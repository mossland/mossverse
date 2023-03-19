import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Erc20, Id, LoadService } from "@shared/util-server";
import { UserService } from "../user/user.service";
import * as gql from "./../gql";
import * as db from "./../db";
import { srv as shared } from "@shared/module";
import { srv as platform } from "@platform/module";
import { LuniverseService } from "../luniverse/luniverse.service";
import * as MocWallet from "./mocWallet.model";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class MocWalletService extends LoadService<MocWallet.Mdl, MocWallet.Doc, MocWallet.Input> {
  mmoc: db.shared.Thing.Doc;
  private root: db.MocWallet.Doc;
  constructor(
    @InjectModel(MocWallet.name)
    private readonly MocWallet: MocWallet.Mdl,
    private readonly userService: UserService,
    private readonly thingService: shared.ThingService,
    private readonly ownershipService: shared.OwnershipService,
    private readonly receiptService: platform.ReceiptService,
    private readonly luniverseService: LuniverseService
  ) {
    super(MocWalletService.name, MocWallet);
  }
  async onModuleInit() {
    this.mmoc = await this.thingService.generate("MMOC");
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
      (await this.MocWallet.pickOne({ status: "active", type: "general", user: null }));

    // if (!mocWallet.isActive()) throw new Error("this wallet is not active");
    return await mocWallet.deposit(user._id);
  }

  async withdraw(userId: Id, address: string, amount: number) {
    const user = await this.userService.get(userId);
    const hasThing = await this.ownershipService.hasThing(user._id, this.mmoc._id, amount);
    if (!hasThing) throw new Error("Not enouth MMOC.");
    //* transfer address
    const inputs = [{ type: "thing" as const, user: user._id, thing: this.mmoc._id, value: amount }];
    const outputs = [{ type: "currency" as const, user: user._id, value: amount, hash: uuidv4() }];
    await this.ownershipService.deltaThings(inputs.map((i) => ({ ...i, thing: this.mmoc, value: -i.value })));
    const receipt = await this.receiptService.create({
      name: "Withdraw MMOC",
      type: "trade",
      from: user._id,
      inputs,
      outputs,
    });
    await this.luniverseService.transfer(this.root.address, address, amount);
    return await receipt.merge({ status: "success", tags: ["MMOC to MOC"] }).save();
  }

  async confirmDeposit(wallet: MocWallet.Doc) {
    const amount = await this.luniverseService.getBalance(wallet.address);
    if (!wallet.user || !amount) throw new Error("Invalid");
    await wallet.merge({ status: "inProgress" }).save();
    const hash = await this.luniverseService.getTxHash(wallet.address);
    const user = await this.userService.get(wallet.user);
    const inputs = [{ type: "currency" as const, user: user._id, value: amount, hash }];
    const outputs = [{ type: "thing" as const, user: user._id, thing: this.mmoc._id, value: amount }];
    await this.ownershipService.deltaThings(outputs.map((o) => ({ ...o, thing: this.mmoc })));
    const receipt = await this.receiptService.create({
      name: "Deposit MMOC",
      type: "trade",
      from: user._id,
      inputs,
      outputs,
    });

    await this.luniverseService.transfer(wallet.address, this.root.address, amount);
    await wallet.merge({ status: "active" }).save();
    return await receipt.merge({ status: "success", tags: ["MOC to MMOC"] }).save();
  }

  async confirmDepositAll() {
    const wallets = await this.MocWallet.find({ status: "reserved", type: "general" });
    this.logger.verbose(`moc wallet confirm deposit start`);
    this.logger.verbose(`found ${wallets.length} reserved wallet`);
    for (const wallet of wallets) await this.confirmDeposit(wallet);
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
  async summarize(): Promise<gql.MocWalletSummary> {
    return {
      totalMocWallet: await this.MocWallet.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
