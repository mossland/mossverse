import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Erc20, Id, LoadService } from "@shared/util-server";
import * as Listing from "./listing.model";
import * as gql from "../gql";
import * as db from "../db";
import * as srv from "../srv";
import { UserService } from "../user/user.service";
import { ReceiptService } from "../receipt/receipt.service";
@Injectable()
export class ListingService extends LoadService<Listing.Mdl, Listing.Doc, Listing.Input> {
  constructor(
    @InjectModel(Listing.name)
    private readonly Listing: Listing.Mdl,
    private readonly userService: UserService,
    private readonly receiptService: ReceiptService,
    private readonly contractService: srv.shared.ContractService,
    private readonly walletService: srv.shared.WalletService,
    private readonly keyringService: srv.shared.KeyringService
  ) {
    super(ListingService.name, Listing);
  }
  async generateListing(data: Listing.Input, address: string) {
    if (await this.Listing.isDuplicated(data)) throw new Error("Listing Already Exists");
    if (data.token) await this.contractService.checkApproval(data.token, data.wallet as Id, data.limit ?? 0);
    (await this.walletService.get(data.wallet as Id)).check(address);
    return await this.Listing.create(data);
  }
  async closeListing(listingId: Id) {
    const listing = await this.Listing.pickById(listingId);
    return await listing.merge({ status: "closed" }).save();
  }
  async purchaseListing(
    listingId: Id,
    priceTag: gql.PriceTagInput,
    num: number,
    shipInfo: gql.ShipInfoInput | null,
    keyring: Id,
    address: string
  ): Promise<db.Receipt.Doc> {
    const user = await this.userService.pick({ keyring });
    const listing = await this.Listing.pickById(listingId);
    if (listing.closeAt.getTime() < Date.now()) await listing.merge({ status: "closed" }).save();
    if (!listing.isPurchaseable()) throw new Error("This listing is not purchasable");
    const receipt = listing.thing
      ? await this.#processThingListing(listing, user, priceTag, num)
      : listing.token
      ? await this.#processTokenListing(listing, user, priceTag, num, address)
      : listing.product
      ? await this.#processProductListing(listing, user, priceTag, num)
      : null;
    if (!receipt) throw new Error("Not supported Yet");
    listing.limit &&
      (await this.Listing.updateOne(
        { _id: listing._id },
        { $inc: { limit: -num }, $set: { ...(listing.limit - num <= 0 ? { status: "soldout" } : {}) } }
      ));
    return await receipt.merge({ status: "success", shipInfo: shipInfo ?? undefined }).save();
  }
  async expireListingsAll() {
    this.logger.verbose(`Listing Expiration Start`);
    const { modifiedCount } = await this.Listing.updateMany(
      { status: "active", closeAt: { $lte: new Date() } },
      { $set: { status: "closed" } }
    );
    this.logger.verbose(`Listing Expiration Finished Count: ${modifiedCount}`);
  }
  async #processTokenListing(
    listing: Listing.Doc,
    user: db.User.Doc,
    priceTag: gql.PriceTagInput,
    num: number,
    address: string
  ): Promise<db.Receipt.Doc> {
    if (listing.isPurchaseWith("thing", priceTag)) {
      const keyring = await this.keyringService.get(user.keyring);
      const fromWallet = await this.walletService.pick({ address });
      if (!keyring.has(fromWallet._id))
        throw new Error(`Not Owner of Wallet fromwallet : ${fromWallet}  keyring: ${keyring}`);
      const inputs: gql.ExchangeInput[] = [{ type: "thing", thing: priceTag.thing, num: priceTag.price * num }];
      const outputs: gql.ExchangeInput[] = [{ type: "token", token: listing.token, num }];
      await this.contractService.checkApproval(listing.token as Id, listing.wallet as Id, listing.limit ?? 0);
      const [buyer, seller] = await this.userService.exchangeItems(user._id, listing.user, inputs);
      const receipt = await this.receiptService.create({
        name: `Token Listing from ${seller.nickname} to ${buyer.nickname}`,
        type: "purchase",
        from: buyer._id,
        fromWallet: fromWallet._id,
        to: seller._id,
        toWallet: listing.wallet,
        listing: listing._id,
        inputs,
        outputs,
      });
      await this.contractService.transfer(listing.token as Id, listing.wallet as Id, fromWallet._id, num);
      //! check the success of tx
      return receipt;
    } else throw new Error("Currently Only Supports Thing Purchases");
  }
  async #processThingListing(
    listing: Listing.Doc,
    user: db.User.Doc,
    priceTag: gql.PriceTagInput,
    num: number
  ): Promise<db.Receipt.Doc> {
    if (listing.isPurchaseWith("thing", priceTag)) {
      const inputs: gql.ExchangeInput[] = [{ type: "thing", thing: priceTag.thing, num: priceTag.price * num }];
      const outputs: gql.ExchangeInput[] = [{ type: "thing", thing: listing.thing, num }];
      const exchanges = [...inputs, ...outputs.map((o) => ({ ...o, num: -num }))];
      const [buyer, seller] = await this.userService.exchangeItems(user._id, listing.user, exchanges);
      const receipt = await this.receiptService.create({
        name: `Thing Listing from ${seller.nickname} to ${buyer.nickname}`,
        type: "purchase",
        from: buyer._id,
        to: seller._id,
        listing: listing._id,
        inputs,
        outputs,
      });
      return receipt;
    } else throw new Error("Currently Only Supports Thing Purchases");
  }
  async #processProductListing(
    listing: Listing.Doc,
    user: db.User.Doc,
    priceTag: gql.PriceTagInput,
    num: number
  ): Promise<db.Receipt.Doc> {
    if (listing.isPurchaseWith("thing", priceTag)) {
      const inputs: gql.ExchangeInput[] = [{ type: "thing", thing: priceTag.thing, num: priceTag.price * num }];
      const outputs: gql.ExchangeInput[] = [];
      const exchanges = [...inputs, ...outputs.map((o) => ({ ...o, num: -num }))];
      const [buyer, seller] = await this.userService.exchangeItems(user._id, listing.user, exchanges);
      const receipt = await this.receiptService.create({
        name: `Product Listing from ${seller.nickname} to ${buyer.nickname}`,
        type: "purchase",
        from: buyer._id,
        to: seller._id,
        listing: listing._id,
        inputs,
        outputs,
      });
      return receipt;
    } else throw new Error("Currently Only Supports Thing Purchases");
  }
}
