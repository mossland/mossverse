import * as MocWallet from "./mocWallet.document";
import * as cnst from "../cnst";
import * as doc from "../doc";
import { Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LuniverseEmployee } from "../luniverse/luniverse.employee";
import { UserEmployee } from "../user/user.employee";
import { emp as platform } from "@platform/server";
import { emp as shared } from "@shared/server";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class MocWalletEmployee extends LoadService<MocWallet.Mdl, MocWallet.Doc, MocWallet.Input> {
  mmoc: doc.shared.Thing.Doc;
  private root: doc.MocWallet.Doc;
  constructor(
    @InjectModel(MocWallet.name)
    private readonly MocWallet: MocWallet.Mdl,
    private readonly userEmployee: UserEmployee,
    private readonly thingEmployee: shared.ThingEmployee,
    private readonly ownershipEmployee: shared.OwnershipEmployee,
    private readonly receiptEmployee: platform.ReceiptEmployee,
    private readonly luniverseEmployee: LuniverseEmployee
  ) {
    super(MocWalletEmployee.name, MocWallet);
  }
  async onModuleInit() {
    this.mmoc = await this.thingEmployee.generate("MMOC");
    this.root = await this.generateRoot("0xbb68b9fc7d7521b1a017d2f49e8f2569e02315df");
  }

  async generateRoot(address: string) {
    return (
      (await this.MocWallet.findOne({ address, type: "root" })) ??
      (await this.MocWallet.create({ address, type: "root" }))
    );
  }

  async deposit(user: Id) {
    const mocWallet =
      (await this.MocWallet.findOne({ user })) ??
      (await this.MocWallet.pickOne({
        status: "active",
        type: "general",
        user: null,
      }));

    // if (!mocWallet.isActive()) throw new Error("this wallet is not active");
    return await mocWallet.deposit(user._id);
  }

  async withdraw(userId: Id, address: string, amount: number) {
    const user = await this.userEmployee.get(userId);
    const hasThing = await this.ownershipEmployee.hasThing(user._id, this.mmoc._id, amount);
    if (!hasThing) throw new Error("Not enouth MMOC.");
    //* transfer address
    const inputs = [
      {
        type: "thing" as const,
        user: user._id,
        thing: this.mmoc._id,
        value: amount,
      },
    ];
    const outputs = [
      {
        type: "currency" as const,
        user: user._id,
        value: amount,
        hash: uuidv4(),
      },
    ];
    await this.ownershipEmployee.deltaThings(inputs.map((i) => ({ ...i, thing: this.mmoc, value: -i.value })));
    const receipt = await this.receiptEmployee.create({
      name: "Withdraw MMOC",
      type: "trade",
      from: user._id,
      inputs,
      outputs,
    });
    await this.luniverseEmployee.transfer(this.root.address, address, amount);
    return await receipt.merge({ status: "success", tags: ["MMOC to MOC"] }).save();
  }

  async test() {
    const amount = await this.luniverseEmployee.getBalance("0x22f6e498dd8bacdde0cf1335e60b45b2e603bcfd");

    console.log("luniverse amount", amount);
  }

  async confirmDeposit(wallet: MocWallet.Doc) {
    const amount = await this.luniverseEmployee.getBalance(wallet.address);
    if (!wallet.user || !amount) return;
    await wallet.merge({ status: "inProgress" }).save();
    const hash = await this.luniverseEmployee.getTxHash(wallet.address);
    const user = await this.userEmployee.get(wallet.user);
    const inputs = [{ type: "currency" as const, user: user._id, value: amount, hash }];
    const outputs = [
      {
        type: "thing" as const,
        user: user._id,
        thing: this.mmoc._id,
        value: amount,
      },
    ];
    await this.ownershipEmployee.deltaThings(outputs.map((o) => ({ ...o, thing: this.mmoc })));
    const receipt = await this.receiptEmployee.create({
      name: "Deposit MMOC",
      type: "trade",
      from: user._id,
      inputs,
      outputs,
    });

    await this.luniverseEmployee.transfer(wallet.address, this.root.address, amount);
    await wallet.merge({ status: "active" }).save();
    return await receipt.merge({ status: "success", tags: ["MOC to MMOC"] }).save();
  }

  async confirmDepositAll() {
    const wallets = await this.MocWallet.find({
      status: "reserved",
      type: "general",
    });
    this.logger.verbose(`moc wallet confirm deposit start`);
    this.logger.verbose(`found ${wallets.length} reserved wallet`);

    // for (const wallet of wallets) await this.confirmDeposit(wallet);
    this.logger.verbose(`moc wallet confirm deposit end`);
  }

  async checkReservedAll() {
    const wallets = await this.MocWallet.find({ status: "reserved" });
    this.logger.verbose(`moc wallet check reserve start`);
    this.logger.verbose(`found ${wallets.length} reserved wallet`);

    for (const wallet of wallets) {
      if (wallet.expireAt.getTime() < new Date().getTime()) await wallet.merge({ status: "active" }).save();
    }
    this.logger.verbose(`moc wallet check reserve end`);
  }
  async summarize(): Promise<cnst.MocWalletSummary> {
    return {
      totalMocWallet: await this.MocWallet.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
