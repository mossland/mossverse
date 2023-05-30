import * as Raffle from "./raffle.document";
import * as cnst from "../cnst";
import * as doc from "../doc";
import * as emp from "../emp";
import { Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RaffleEmployee extends LoadService<Raffle.Mdl, Raffle.Doc, Raffle.Input> {
  constructor(
    @InjectModel(Raffle.name)
    private readonly Raffle: Raffle.Mdl,
    private readonly userEmployee: emp.UserEmployee,
    private readonly receiptEmployee: emp.ReceiptEmployee,
    private readonly shipInfoEmployee: emp.ShipInfoEmployee,
    private readonly ownershipEmployee: emp.shared.OwnershipEmployee,
    private readonly keyringEmployee: emp.shared.KeyringEmployee,
    private readonly thingEmployee: emp.shared.ThingEmployee,
    private readonly contractEmployee: emp.shared.ContractEmployee,
    private readonly walletEmployee: emp.shared.WalletEmployee
  ) {
    super(RaffleEmployee.name, Raffle);
  }

  async raffle(raffleId: Id, priceTag: cnst.PriceTagInput, keyring: Id, address: string): Promise<doc.Receipt.Doc> {
    const user = await this.userEmployee.pick({ keyring });
    const ownership = await this.ownershipEmployee.pick({
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
    user: doc.User.Doc,
    priceTag: cnst.PriceTagInput,
    address: string
  ): Promise<doc.Receipt.Doc> {
    if (raffle.isPurchaseWith("thing", priceTag)) {
      const keyring = await this.keyringEmployee.get(user.keyring);
      const fromWallet = await this.walletEmployee.pick({ address });
      if (!keyring.has(fromWallet._id))
        throw new Error(`Not Owner of Wallet fromwallet : ${fromWallet}  keyring: ${keyring}`);
      const inputs: cnst.ExchangeInput[] = [{ type: "thing", thing: raffle.thing, value: 1 }];
      const outputs: cnst.ExchangeInput[] = [{ type: "thing", thing: priceTag.thing, value: priceTag.price }];
      //! token 미구현
      // await this.contractEmployee.checkApproval(raffle.token as Id, raffle.wallet as Id, raffle.limit ?? 0);
      const raffler = await this.userEmployee.load(user._id);
      if (!raffler) throw new Error("Raffler not found");
      await this.ownershipEmployee.reduceThing(
        (await this.thingEmployee.load(priceTag.thing)) as doc.shared.Thing.Doc,
        raffler._id,
        priceTag.price
      );
      const receipt = await this.receiptEmployee.create({
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

  async rafflePick(raffleId: Id): Promise<doc.User.Doc[]> {
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
    return await this.userEmployee.loadMany(winners);
  }

  async addWinnerShipInfo(
    raffleId: Id,
    shipInfo: cnst.ShipInfoInput,
    keyring: Id,
    address: string
  ): Promise<doc.ShipInfo.Doc> {
    const user = await this.userEmployee.pick({ keyring });
    const raffle = await this.get(raffleId);
    if (!raffle.isPicked(user.id)) throw new Error("Raffle is not exist");
    if (!raffle.product) throw new Error("Raffle Product is not exist");
    return await this.shipInfoEmployee.create({
      ...shipInfo,
      user: user.id,
      product: raffle.product,
    });
  }

  async checkClosedRaffles(): Promise<void> {
    const raffles = await this.Raffle.find({
      status: { $ne: "closed" },
      closeAt: { $lte: Date.now() },
    });
    for (const raffle of raffles) await raffle.merge({ status: "raffled" }).save();
  }

  async checkRafflePlcksUser(): Promise<void> {
    const raffles = await this.Raffle.find({
      status: "raffled",
      announceAt: { $lte: Date.now() },
    });
    for (const raffle of raffles) await this.rafflePick(raffle._id);
  }

  async summarize(): Promise<cnst.RaffleSummary> {
    return {
      totalRaffle: await this.Raffle.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
