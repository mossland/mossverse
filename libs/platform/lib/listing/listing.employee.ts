import * as Listing from "./listing.document";
import * as cnst from "../cnst";
import * as doc from "../doc";
import { Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { ReceiptEmployee } from "../receipt/receipt.employee";
import { ShipInfoEmployee } from "../shipInfo/shipInfo.employee";
import { UserEmployee } from "../user/user.employee";
import { emp as shared } from "@shared/server";
@Injectable()
export class ListingEmployee extends LoadService<Listing.Mdl, Listing.Doc, Listing.Input> {
  constructor(
    @InjectModel(Listing.name)
    private readonly Listing: Listing.Mdl,
    private readonly userEmployee: UserEmployee,
    private readonly receiptEmployee: ReceiptEmployee,
    private readonly shipInfoEmployee: ShipInfoEmployee,
    private readonly contractEmployee: shared.ContractEmployee,
    private readonly walletEmployee: shared.WalletEmployee,
    private readonly thingEmployee: shared.ThingEmployee,
    private readonly tokenEmployee: shared.TokenEmployee,
    private readonly keyringEmployee: shared.KeyringEmployee,
    private readonly ownershipEmployee: shared.OwnershipEmployee
  ) {
    super(ListingEmployee.name, Listing);
  }
  // override async create(data: Listing.Input, { address }: LoadConfig<Listing.Doc> = {}) {
  //   if (!address) throw new Error("address is required");
  //   return await this.generateListing(data, address);
  // }

  async generateListing(data: Listing.Input, address: string) {
    (await this.walletEmployee.get(data.wallet as Id)).check(address);
    const listing = new this.Listing(data);
    if (listing.thing)
      await this.ownershipEmployee.reserveThings([
        {
          user: listing.user,
          value: listing.value ?? 0,
          thing: (await this.thingEmployee.load(listing.thing)) as doc.shared.Thing.Doc,
        },
      ]);
    else if (listing.token)
      await this.ownershipEmployee.reserveTokens([
        {
          user: listing.user._id,
          value: listing.value ?? 0,
          token: (await this.tokenEmployee.load(listing.token)) as doc.shared.Token.Doc,
        },
      ]);
    else throw new Error("Not supported Yet");
    return await listing.merge({ sale: 0 }).save();
  }
  async closeListing(listingId: Id) {
    const listing = await this.Listing.pickById(listingId);
    if (listing.thing)
      await this.ownershipEmployee.releaseThings([
        {
          user: listing.user,
          value: listing.value ?? 0,
          thing: (await this.thingEmployee.load(listing.thing)) as doc.shared.Thing.Doc,
        },
      ]);
    else if (listing.token)
      await this.ownershipEmployee.releaseTokens([
        {
          user: listing.user._id,
          value: listing.value ?? 0,
          token: (await this.tokenEmployee.load(listing.token)) as doc.shared.Token.Doc,
        },
      ]);
    else throw new Error("Not supported Yet");
    return await listing.merge({ status: "closed" }).save();
  }

  async purchaseListing(
    listingId: Id,
    priceTag: cnst.PriceTagInput,
    num: number,
    shipInfo: cnst.ShipInfoInput | null,
    keyring: Id,
    address: string
  ): Promise<doc.Receipt.Doc> {
    const user = await this.userEmployee.pick({ keyring });
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
    shipInfo && (await this.shipInfoEmployee.create({ ...shipInfo, user: user.id }));
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
    user: doc.User.Doc,
    priceTag: cnst.PriceTagInput,
    value: number,
    address: string
  ): Promise<doc.Receipt.Doc> {
    if (listing.isPurchaseWith("thing", priceTag)) {
      const keyring = await this.keyringEmployee.get(user.keyring);
      const fromWallet = await this.walletEmployee.pick({ address });
      if (!keyring.has(fromWallet._id))
        throw new Error(`Not Owner of Wallet fromwallet : ${fromWallet}  keyring: ${keyring}`);
      const totalValue = (priceTag.discountPrice ?? priceTag.price) * value;
      const inputs: cnst.ExchangeInput[] = [{ type: "thing", thing: priceTag.thing, value: totalValue }];
      const outputs: cnst.ExchangeInput[] = [{ type: "token", token: listing.token, value }];
      await this.contractEmployee.checkApproval(listing.token as Id, listing.wallet as Id, listing.value ?? 0);
      const [buyer, seller] = await this.userEmployee.loadMany([user._id, listing.user]);
      await this.ownershipEmployee.transferThing(
        (await this.thingEmployee.load(priceTag.thing)) as doc.shared.Thing.Doc,
        buyer._id,
        seller._id,
        totalValue
      );
      const receipt = await this.receiptEmployee.create({
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
      await this.contractEmployee.transfer(listing.token as Id, listing.wallet as Id, fromWallet._id, value);
      //! check the success of tx
      return receipt;
    } else throw new Error("Currently Only Supports Thing Purchases");
  }
  async #processThingListing(
    listing: Listing.Doc,
    user: doc.User.Doc,
    priceTag: cnst.PriceTagInput,
    value: number
  ): Promise<doc.Receipt.Doc> {
    if (listing.isPurchaseWith("thing", priceTag)) {
      const totalValue = (priceTag.discountPrice ?? priceTag.price) * value;
      const inputs = [
        {
          type: "thing" as const,
          thing: priceTag.thing as Id,
          value: totalValue,
        },
      ];
      const outputs = [{ type: "thing" as const, thing: listing.thing as Id, value }];
      const exchanges = [...inputs, ...outputs.map((o) => ({ ...o, value: -value }))];
      const [buyer, seller] = await this.userEmployee.loadMany([user._id, listing.user]);
      const deltas = [
        ...exchanges.map((e) => ({ ...e, user: seller._id })),
        ...exchanges.map((e) => ({ ...e, user: buyer._id, value: -e.value })),
      ];
      await this.ownershipEmployee.deltaThings(
        await Promise.all(
          deltas.map(async (d) => ({
            thing: (await this.thingEmployee.load(d.thing)) as doc.shared.Thing.Doc,
            user: d.user,
            value: d.value,
          }))
        )
      );
      const receipt = await this.receiptEmployee.create({
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
    user: doc.User.Doc,
    priceTag: cnst.PriceTagInput,
    value: number
  ): Promise<doc.Receipt.Doc> {
    if (listing.isPurchaseWith("thing", priceTag)) {
      const totalValue = (priceTag.discountPrice ?? priceTag.price) * value;
      const inputs: cnst.ExchangeInput[] = [{ type: "thing", thing: priceTag.thing, value: totalValue }];
      const outputs: cnst.ExchangeInput[] = [{ type: "product", product: listing.product, value }];
      const exchanges = [...inputs, ...outputs.map((o) => ({ ...o, value: -value }))];
      const [buyer, seller] = await this.userEmployee.loadMany([user._id, listing.user]);
      // await this.ownershipEmployee.transferThing(priceTag.thing as Id, buyer._id, seller._id, totalValue);
      //? 유저가 실물을 팔 수 있는지?
      //? 소각시킬지 루트계정으로 보낼지?
      await this.ownershipEmployee.reduceThing(
        (await this.thingEmployee.load(priceTag.thing)) as doc.shared.Thing.Doc,
        buyer._id,
        totalValue
      );
      const receipt = await this.receiptEmployee.create({
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
  async summarize(): Promise<cnst.ListingSummary> {
    return {
      totalListing: await this.Listing.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
