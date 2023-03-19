import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Raffle from "./raffle.model";
import * as fs from "fs";
import { Id, LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";

@Injectable()
export class RaffleService extends LoadService<Raffle.Mdl, Raffle.Doc, Raffle.Input> {
  constructor(
    @InjectModel(Raffle.name)
    private readonly Raffle: Raffle.Mdl,
    private readonly userService: srv.UserService,
    private readonly receiptService: srv.ReceiptService,
    private readonly shipInfoService: srv.ShipInfoService,
    private readonly ownershipService: srv.shared.OwnershipService,
    private readonly keyringService: srv.shared.KeyringService,
    private readonly thingService: srv.shared.ThingService,
    private readonly contractService: srv.shared.ContractService,
    private readonly walletService: srv.shared.WalletService
  ) {
    super(RaffleService.name, Raffle);
  }

  async raffle(raffleId: Id, priceTag: gql.PriceTagInput, keyring: Id, address: string): Promise<db.Receipt.Doc> {
    const user = await this.userService.pick({ keyring });
    const ownership = await this.ownershipService.pick({
      user: user._id,
      status: "active",
      ...(priceTag.type === "thing" ? { thing: priceTag.thing?._id } : { token: priceTag.token?._id }),
    });
    if (!ownership) throw new Error("Ownership not found");
    const raffle = await this.get(raffleId);
    if (raffle.status !== "active") throw new Error("Raffle is not active");
    if (raffle.closeAt.getTime() < Date.now()) throw new Error("Raffle is closed");
    if (raffle.isEntryExceed(user._id)) throw new Error("Raffle entry is exceed");
    return await this.#processThingRaffle(raffle, user, priceTag, address);
  }

  async #processThingRaffle(
    raffle: Raffle.Doc,
    user: db.User.Doc,
    priceTag: gql.PriceTagInput,
    address: string
  ): Promise<db.Receipt.Doc> {
    if (raffle.isPurchaseWith("thing", priceTag)) {
      const keyring = await this.keyringService.get(user.keyring);
      const fromWallet = await this.walletService.pick({ address });
      if (!keyring.has(fromWallet._id))
        throw new Error(`Not Owner of Wallet fromwallet : ${fromWallet}  keyring: ${keyring}`);
      const inputs: gql.ExchangeInput[] = [{ type: "thing", thing: raffle.thing, value: 1 }];
      const outputs: gql.ExchangeInput[] = [{ type: "thing", thing: priceTag.thing, value: priceTag.price }];
      //! token 미구현
      // await this.contractService.checkApproval(raffle.token as Id, raffle.wallet as Id, raffle.limit ?? 0);
      const raffler = await this.userService.load(user._id);
      if (!raffler) throw new Error("Raffler not found");
      await this.ownershipService.reduceThing(
        (await this.thingService.load(priceTag.thing)) as db.shared.Thing.Doc,
        raffler._id,
        priceTag.price
      );
      const receipt = await this.receiptService.create({
        name: `Rallfe from ${raffler.nickname} ${raffle.id}`,
        type: "raffle",
        from: raffler._id,
        fromWallet: fromWallet._id,
        raffle: raffle._id,
        inputs,
        outputs,
      }); // ! 고쳐야함 우선 빌드가능하게 해놈
      await raffle.addEntry(user._id).save();

      //! check the success of tx
      return receipt;
    } else throw new Error("Currently Only Supports Thing Purchases");
  }

  async rafflePick(raffleId: Id): Promise<db.User.Doc[]> {
    const raffle = await this.get(raffleId);
    if (raffle.status !== "raffled") throw new Error("Raffle is not active");
    if (raffle.closeAt.getTime() > Date.now()) throw new Error("Raffle is not closed");
    await raffle.merge({ status: "inProgress" }).save();
    const users: Id[] = raffle.entries.reduce(
      (acc, cur) => [
        ...acc,
        ...Array(cur.value)
          .fill("")
          .map((c) => cur.user),
      ],
      []
    );
    const winners: Id[] = [];

    for (let i = 0; i < raffle.totalRaffleNum; i++) {
      users
        .filter((user) => !winners.includes(user))
        .forEach((user) => {
          if (winners.includes(user)) return;
          const random = Math.floor(Math.random() * users.length);
          winners.push(users[random]);
        });
    }
    await raffle.merge({ status: "closed", winners }).save();
    return await this.userService.loadMany(winners);
  }

  async addWinnerShipInfo(
    raffleId: Id,
    shipInfo: gql.ShipInfoInput,
    keyring: Id,
    address: string
  ): Promise<db.ShipInfo.Doc> {
    const user = await this.userService.pick({ keyring });
    const raffle = await this.get(raffleId);
    if (!raffle.isPicked(user.id)) throw new Error("Raffle is not exist");
    if (!raffle.product) throw new Error("Raffle Product is not exist");
    return await this.shipInfoService.create({ ...shipInfo, user: user.id, product: raffle.product });
  }

  async checkClosedRaffles(): Promise<void> {
    const raffles = await this.Raffle.find({ status: { $ne: "closed" }, closeAt: { $lte: Date.now() } });
    for (const raffle of raffles) await raffle.merge({ status: "raffled" }).save();
  }

  async checkRafflePlcksUser(): Promise<void> {
    const raffles = await this.Raffle.find({ status: "raffled", announceAt: { $lte: Date.now() } });
    for (const raffle of raffles) await this.rafflePick(raffle._id);
  }

  async summarize(): Promise<gql.RaffleSummary> {
    return {
      totalRaffle: await this.Raffle.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
