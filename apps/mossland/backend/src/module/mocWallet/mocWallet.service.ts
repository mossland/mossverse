import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Erc20, Id, LoadService } from "@shared/util-server";
import { UserService } from "../user/user.service";
import * as gql from "./../gql";
import * as db from "./../db";
import * as srv from "./../srv";
import axios, { AxiosInstance } from "axios";
import * as MocWallet from "./mocWallet.model";

@Injectable()
export class MocWalletService extends LoadService<MocWallet.Mdl, MocWallet.Doc, MocWallet.Input> {
  mmoc: db.shared.Thing.Doc;
  private root: db.MocWallet.Doc;
  constructor(
    @InjectModel(MocWallet.name)
    private readonly MocWallet: MocWallet.Mdl,
    private readonly userService: UserService,
    private readonly thingService: srv.shared.ThingService,
    private readonly receiptService: srv.platform.ReceiptService,
    private readonly luniverseService: srv.LuniverseService
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
    if (!user.hasItem(this.mmoc._id, amount)) throw new Error("Not enouth MMOC.");
    //* transfer address
    const hash = await this.luniverseService.transfer(this.root.address, address, amount);
    const inputs: gql.platform.ExchangeInput[] = [{ type: "thing", thing: this.mmoc.id, num: amount }];
    const outputs: gql.platform.ExchangeInput[] = [{ type: "etc", num: amount, hash }];

    await user.decItems(inputs).save();
    const receipt = await this.receiptService.create({
      type: "trade",
      from: user._id,
      inputs,
      outputs,
    });
    return await receipt.merge({ status: "success", tag: ["MMOC to MOC"] }).save();
  }

  async confirmDeposit(wallet: MocWallet.Doc) {
    const amount = await this.luniverseService.getBalance(wallet.address);
    if (!wallet.user || !amount) throw new Error("Invalid");
    await wallet.merge({ status: "inProgress" }).save();
    const hash = await this.luniverseService.getTxHash(wallet.address);
    const user = await this.userService.get(wallet.user);
    const inputs: gql.platform.ExchangeInput[] = [{ type: "etc", num: amount, hash }];
    const outputs: gql.platform.ExchangeInput[] = [{ type: "thing", thing: this.mmoc.id, num: amount }];
    await user.incItems(outputs).save();
    const receipt = await this.receiptService.create({
      type: "trade",
      from: user._id,
      inputs,
      outputs,
    });

    await this.luniverseService.transfer(wallet.address, this.root.address, amount);
    await wallet.merge({ status: "active" }).save();
    return await receipt.merge({ status: "success", tag: ["MOC to MMOC"] }).save();
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
}
