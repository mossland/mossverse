import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Erc20, Id, LoadConfig, LoadService } from "@shared/util-server";
import * as Listing from "./listing.model";
import * as gql from "../gql";
import * as db from "../db";
import { srv as shared } from "@shared/module";
import { UserService } from "../user/user.service";
import { ReceiptService } from "../receipt/receipt.service";
import { ShipInfoService } from "../shipInfo/shipInfo.service";
import { cnst } from "@shared/util";
@Injectable()
export class ListingService extends LoadService<Listing.Mdl, Listing.Doc, Listing.Input> {
  constructor(
    @InjectModel(Listing.name)
    private readonly Listing: Listing.Mdl,
    private readonly userService: UserService,
    private readonly receiptService: ReceiptService,
    private readonly shipInfoService: ShipInfoService,
    private readonly contractService: shared.ContractService,
    private readonly walletService: shared.WalletService,
    private readonly thingService: shared.ThingService,
    private readonly tokenService: shared.TokenService,
    private readonly keyringService: shared.KeyringService,
    private readonly ownershipService: shared.OwnershipService
  ) {
    super(ListingService.name, Listing);
  }
  // override async create(data: Listing.Input, { address }: LoadConfig<Listing.Doc> = {}) {
  //   if (!address) throw new Error("address is required");
  //   return await this.generateListing(data, address);
  // }

  async generateListing(data: Listing.Input, address: string) {
    (await this.walletService.get(data.wallet as Id)).check(address);
    const listing = new this.Listing(data);
    if (listing.thing)
      await this.ownershipService.reserveThings([
        {
          user: listing.user,
          value: listing.value ?? 0,
          thing: (await this.thingService.load(listing.thing)) as db.shared.Thing.Doc,
        },
      ]);
    else if (listing.token)
      await this.ownershipService.reserveTokens([
        {
          user: listing.user._id,
          value: listing.value ?? 0,
          token: (await this.tokenService.load(listing.token)) as db.shared.Token.Doc,
        },
      ]);
    else throw new Error("Not supported Yet");
    return await listing.merge({ sale: 0 }).save();
  }
  async closeListing(listingId: Id) {
    const listing = await this.Listing.pickById(listingId);
    if (listing.thing)
      await this.ownershipService.releaseThings([
        {
          user: listing.user,
          value: listing.value ?? 0,
          thing: (await this.thingService.load(listing.thing)) as db.shared.Thing.Doc,
        },
      ]);
    else if (listing.token)
      await this.ownershipService.releaseTokens([
        {
          user: listing.user._id,
          value: listing.value ?? 0,
          token: (await this.tokenService.load(listing.token)) as db.shared.Token.Doc,
        },
      ]);
    else throw new Error("Not supported Yet");
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
    if (listing.closeAt && listing.closeAt.getTime() < Date.now()) await listing.merge({ status: "closed" }).save();
    if (!listing.isPurchaseable()) throw new Error("This listing is not purchasable");
    const receipt = listing.thing
      ? await this.#processThingListing(listing, user, priceTag, num)
      : listing.token
      ? await this.#processTokenListing(listing, user, priceTag, num, address)
      : listing.product
      ? await this.#processProductListing(listing, user, priceTag, num)
      : null;
    if (!receipt) throw new Error("Not supported Yet");
    await this.Listing.updateOne(
      { _id: listing._id },
      {
        $inc: { value: listing.sellingType === "limited" && -num, sale: num },
        $set: {
          ...(listing.sellingType === "limited" && listing.value && listing.value - num <= 0
            ? { status: "soldout" }
            : {}),
        },
      }
    );
    shipInfo && (await this.shipInfoService.create({ ...shipInfo, user: user.id }));
    return await receipt.merge({ status: "success" }).save();
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
    value: number,
    address: string
  ): Promise<db.Receipt.Doc> {
    if (listing.isPurchaseWith("thing", priceTag)) {
      const keyring = await this.keyringService.get(user.keyring);
      const fromWallet = await this.walletService.pick({ address });
      if (!keyring.has(fromWallet._id))
        throw new Error(`Not Owner of Wallet fromwallet : ${fromWallet}  keyring: ${keyring}`);
      const totalValue = (priceTag.discountPrice ?? priceTag.price) * value;
      const inputs: gql.ExchangeInput[] = [{ type: "thing", thing: priceTag.thing, value: totalValue }];
      const outputs: gql.ExchangeInput[] = [{ type: "token", token: listing.token, value }];
      await this.contractService.checkApproval(listing.token as Id, listing.wallet as Id, listing.value ?? 0);
      const [buyer, seller] = await this.userService.loadMany([user._id, listing.user]);
      await this.ownershipService.transferThing(
        (await this.thingService.load(priceTag.thing)) as db.shared.Thing.Doc,
        buyer._id,
        seller._id,
        totalValue
      );
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
      await this.contractService.transfer(listing.token as Id, listing.wallet as Id, fromWallet._id, value);
      //! check the success of tx
      return receipt;
    } else throw new Error("Currently Only Supports Thing Purchases");
  }
  async #processThingListing(
    listing: Listing.Doc,
    user: db.User.Doc,
    priceTag: gql.PriceTagInput,
    value: number
  ): Promise<db.Receipt.Doc> {
    if (listing.isPurchaseWith("thing", priceTag)) {
      const totalValue = (priceTag.discountPrice ?? priceTag.price) * value;
      const inputs = [{ type: "thing" as const, thing: priceTag.thing as Id, value: totalValue }];
      const outputs = [{ type: "thing" as const, thing: listing.thing as Id, value }];
      const exchanges = [...inputs, ...outputs.map((o) => ({ ...o, value: -value }))];
      const [buyer, seller] = await this.userService.loadMany([user._id, listing.user]);
      const deltas = [
        ...exchanges.map((e) => ({ ...e, user: seller._id })),
        ...exchanges.map((e) => ({ ...e, user: buyer._id, value: -e.value })),
      ];
      await this.ownershipService.deltaThings(
        await Promise.all(
          deltas.map(async (d) => ({
            thing: (await this.thingService.load(d.thing)) as db.shared.Thing.Doc,
            user: d.user,
            value: d.value,
          }))
        )
      );
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
    value: number
  ): Promise<db.Receipt.Doc> {
    if (listing.isPurchaseWith("thing", priceTag)) {
      const totalValue = (priceTag.discountPrice ?? priceTag.price) * value;
      const inputs: gql.ExchangeInput[] = [{ type: "thing", thing: priceTag.thing, value: totalValue }];
      const outputs: gql.ExchangeInput[] = [{ type: "product", product: listing.product, value }];
      const exchanges = [...inputs, ...outputs.map((o) => ({ ...o, value: -value }))];
      const [buyer, seller] = await this.userService.loadMany([user._id, listing.user]);
      // await this.ownershipService.transferThing(priceTag.thing as Id, buyer._id, seller._id, totalValue);
      //? 유저가 실물을 팔 수 있는지?
      //? 소각시킬지 루트계정으로 보낼지?
      await this.ownershipService.reduceThing(
        (await this.thingService.load(priceTag.thing)) as db.shared.Thing.Doc,
        buyer._id,
        totalValue
      );
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
  async summarize(): Promise<gql.ListingSummary> {
    return {
      totalListing: await this.Listing.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
