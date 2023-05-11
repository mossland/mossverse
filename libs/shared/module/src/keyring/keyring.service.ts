import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Id, LoadService } from "@shared/util-server";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as Keyring from "./keyring.model";
import * as gql from "../gql";
import * as db from "../db";
import { WalletService } from "../wallet/wallet.service";
import { ContractService } from "../contract/contract.service";
import { SecurityService } from "../security/security.service";
import { UserService } from "../user/user.service";
import { srv as external } from "@external/module";
import { Utils, cnst } from "@shared/util";
import { SecurityOptions } from "../option";

@Injectable()
export class KeyringService extends LoadService<Keyring.Mdl, Keyring.Doc, Keyring.Input> {
  constructor(
    @Inject("SECURITY_OPTIONS") private readonly options: SecurityOptions,
    @InjectModel(Keyring.name)
    private readonly Keyring: db.Keyring.Mdl,
    private readonly walletService: WalletService,
    private readonly contractService: ContractService,
    private readonly userService: UserService,
    private readonly securityService: SecurityService,
    private readonly mailerService: external.MailerService,
    private readonly messageService: external.MessageService
  ) {
    super(KeyringService.name, Keyring);
  }
  async whoAmI(keyringId: Id, data: Partial<db.User.Doc> = {}) {
    const lastLoginAt = new Date();
    const keyring = await this.Keyring.pickById(keyringId);
    const user = await this.userService.generateWithKeyring(keyringId, data);
    if (!keyring.isFor(user._id)) await keyring.merge({ user: user._id });
    await keyring.merge({ lastLoginAt }).save();
    return await user.merge({ lastLoginAt }).save();
  }
  async generateToken(keyring: Keyring.Doc) {
    const user = await this.whoAmI(keyring._id);
    return this.securityService.generateToken(keyring, user);
  }

  //*=================================================================*//
  //*====================== Wallet Signing Area ======================*//
  async getKeyringIdHasWallet(networkId: Id, address: string) {
    const wallet = await this.walletService.myWallet(networkId, address);
    return (await this.Keyring.findOne({ wallets: wallet._id, status: "active" }))?._id;
  }
  async signupWallet(networkId: Id, keyringId: Id | null, address: string): Promise<Keyring.Doc> {
    const wallet = await this.walletService.myWallet(networkId, address);
    const keyring = await this.Keyring.generateWithWallet(wallet._id, keyringId);
    const num = await this.Keyring.extinctWallet(wallet._id, keyring._id);
    this.logger.log(`${num} Keyrings removed for wallet(${wallet._id}) - ${address}`);
    this.contractService.inventory(wallet);
    return keyring;
  }
  async signinWallet(networkId: Id, address: string): Promise<gql.AccessToken> {
    const wallet = await this.walletService.myWallet(networkId, address);
    const keyring = await this.Keyring.pickOne({ wallets: wallet._id });
    if (keyring.status !== "active") throw new Error("Not activated yet");
    return this.generateToken(keyring);
  }
  async signaddWallet(networkId: Id, address: string, keyringId: Id) {
    const wallet = await this.walletService.myWallet(networkId, address);
    const keyring = await this.Keyring.pickById(keyringId);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    const num = await this.Keyring.extinctWallet(wallet._id, keyring._id);
    this.logger.log(`${num} Keyrings removed for wallet(${wallet._id}) - ${address}`);
    await this.contractService.inventory(wallet);
    return await keyring.addWallet(wallet._id).save();
  }
  async signsubWallet(walletId: Id, keyringId: Id) {
    const keyring = await this.Keyring.pickById(keyringId);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    return await keyring.subWallet(walletId).save();
  }
  //*====================== Wallet Signing Area ======================*//
  //*=================================================================*//

  //*===================================================================*//
  //*====================== Password Signing Area ======================*//
  async getKeyringIdHasAccountId(accountId: string) {
    return (await this.Keyring.findOne({ accountId, status: "active" }))?._id;
  }
  async signupPassword(accountId: string, password: string, keyringId: Id | null): Promise<Keyring.Doc> {
    const keyring = await this.Keyring.generateWithAccountId(accountId, password, keyringId);
    await this.Keyring.extinctAccountId(accountId, keyring._id);
    return keyring;
  }
  async signinPassword(accountId: string, password: string): Promise<gql.AccessToken> {
    const keyring = await this.Keyring.getAuthorizedKeyring(accountId, password);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    return await this.generateToken(keyring);
  }
  async signaddPassword(accountId: string, password, keyringId: Id) {
    const keyring = await this.Keyring.pickById(keyringId);
    if (keyring.verifies.includes("password")) throw new Error("Already has password");
    if (keyring.status !== "active") throw new Error("Not activated yet");
    await this.Keyring.extinctAccountId(accountId, keyring._id);
    return await keyring.applyIdPassword(accountId, password).save();
  }
  async changePassword(password: string, prevPassword: string, keyringId: Id) {
    const prevKeyring = await this.Keyring.pickById(keyringId);
    const keyring = await this.Keyring.getAuthorizedKeyring(prevKeyring.accountId as string, prevPassword);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    return await keyring.merge({ password }).save();
  }
  async changePasswordWithPhone(password: string, phone: string, phoneCode: string, keyringId: Id) {
    const keyring = await this.Keyring.pickById(keyringId);
    if (!keyring.verifies.includes("phone")) throw new Error("Unable to change password with phone");
    if (keyring.status !== "active") throw new Error("Not activated yet");
    await keyring.consumePhoneVerification(phone, phoneCode).save();
    return await keyring.merge({ password }).save();
  }
  async resetPassword(accountId: string): Promise<boolean> {
    const keyring = await this.Keyring.pickOne({ accountId, status: { $ne: "inactive" } });
    if (keyring.status !== "active") throw new Error("Not activated yet");
    if (keyring.updatedAt.getTime() > Utils.getLastMinutes(3).getTime()) throw new Error(`Retry after 3 minutes`);
    const password = Utils.randomString();
    await keyring.merge({ password }).save();
    return this.mailerService.sendPasswordResetMail(accountId, password);
  }
  //*====================== Password Signing Area ======================*//
  //*===================================================================*//

  //*================================================================*//
  //*====================== Phone Signing Area ======================*//
  async getKeyringIdHasPhone(phone: string) {
    return (await this.Keyring.findOne({ phone, status: "active" }))?._id;
  }
  async addPhoneInPrepareKeyring(phone: string, keyringId: Id | null): Promise<Keyring.Doc> {
    if (await this.Keyring.exists({ phone, status: "active" })) throw new Error("Already used phone number");
    const keyring = await this.Keyring.generateWithPhone(phone, keyringId);
    return keyring;
  }
  async addPhoneInActiveKeyring(phone: string, keyringId: Id): Promise<Keyring.Doc> {
    if (await this.Keyring.exists({ phone, status: "active", _id: { $ne: keyringId }, verifies: "phone" }))
      throw new Error("Already used phone number");
    return await this.Keyring.pickAndWrite(keyringId, { phone });
  }
  async requestPhoneCode(keyringId: Id, phone: string, hash: string) {
    const keyring = await this.Keyring.pickById(keyringId);
    await keyring.applyPhoneCode(phone, Utils.randomCode(6)).save();
    await this.messageService.sendPhoneCode(keyring.phone as string, keyring.phoneCode as string, hash);
    return keyring.getPhoneCodeAt();
  }
  async verifyPhoneCode(keyringId: Id, phone: string, phoneCode: string) {
    const keyring = await this.Keyring.pickById(keyringId);
    return await keyring.applyPhoneVerification(phone, phoneCode).save();
  }
  async signupPhone(keyringId: Id, phone: string, phoneCode: string): Promise<Keyring.Doc> {
    const keyring = await this.Keyring.pickById(keyringId);
    if (keyring.status !== "prepare") throw new Error("Already Activated Keyring");
    await keyring.consumePhoneVerification(phone, phoneCode).save();
    await this.Keyring.extinctPhone(phone, keyring._id);
    return keyring;
  }
  async signinPhone(keyringId: Id, phone: string, phoneCode: string) {
    const keyring = await this.Keyring.pickById(keyringId);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    await keyring.consumePhoneVerification(phone, phoneCode).save();
    return this.generateToken(keyring);
  }
  async signaddPhone(keyringId: Id, phone: string, phoneCode: string) {
    const keyring = await this.Keyring.pickById(keyringId);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    await keyring.consumePhoneVerification(phone, phoneCode).save();
    await this.Keyring.extinctPhone(phone, keyring._id);
    return keyring;
  }
  //*====================== Phone Signing Area ======================*//
  //*================================================================*//
  override async remove(keyringId: Id): Promise<Keyring.Doc> {
    const keyring = await this.Keyring.pickById(keyringId);
    return await keyring.reset().merge({ status: "inactive" }).save();
  }
  async summarize(): Promise<gql.KeyringSummary> {
    return {
      totalKeyring: await this.Keyring.countDocuments({ status: { $ne: "inactive" } }),
    };
  }

  //*====================== SSO Signing Area ======================*//
  //*================================================================*//
  async signupSso(accountId: string, ssoType: cnst.SsoType, keyringId?: Id) {
    const keyring = await this.Keyring.generateWithSSO(accountId, ssoType, keyringId);
    await this.Keyring.extinctAccountId(accountId, keyring._id);
    return keyring;
  }
  async signinSso(accountId: string, ssoType: cnst.SsoType): Promise<gql.AccessToken> {
    const keyring = await this.Keyring.getKeyringWithSSO(accountId, ssoType);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    return this.generateToken(keyring);
  }
  async signaddSso(keyringId: Id, accountId: string, ssoType: cnst.SsoType): Promise<Keyring.Doc> {
    const keyring = await this.Keyring.pickById(keyringId);
    if (keyring.verifies.includes(ssoType)) throw new Error(`Already has ${ssoType} SSO`);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    await keyring.applyIdWithSSO(accountId, ssoType).save();
    await this.Keyring.extinctAccountId(accountId, keyring._id);
    return keyring;
  }

  async activateUser(keyringId: Id) {
    const keyring = await this.Keyring.pickById(keyringId);
    if (keyring.status === "active") throw new Error("Already activated");
    // TODO: check minimum verification levels
    return await keyring.merge({ status: "active" }).save();
  }
}
