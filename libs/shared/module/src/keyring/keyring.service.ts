import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Id, LoadService } from "@shared/util-server";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as Keyring from "./keyring.model";
import * as gql from "../gql";
import * as srv from "../srv";
import * as db from "../db";
import { WalletService } from "../wallet/wallet.service";
import { ContractService } from "../contract/contract.service";
import { MailerService } from "../mailer/mailer.service";
import { Utils } from "@shared/util";
import { SecurityOptions } from "../option";

@Injectable()
export class KeyringService extends LoadService<Keyring.Mdl, Keyring.Doc, Keyring.Input> {
  constructor(
    @Inject("SECURITY_OPTIONS") private readonly options: SecurityOptions,
    @InjectModel(Keyring.name)
    private readonly Keyring: db.Keyring.Mdl,
    private readonly walletService: WalletService,
    private readonly contractService: ContractService,
    private readonly securityService: srv.SecurityService,
    private readonly mailerService: MailerService
  ) {
    super(KeyringService.name, Keyring);
  }

  async generateOtp(keyringId: Id): Promise<gql.Otp> {
    const keyring = await this.Keyring.pickById(keyringId);
    const otpExpireAt = Utils.getNextMinutes(10, new Date());
    const otp = this.securityService.encrypt(otpExpireAt.toString());
    await keyring.merge({ otp, otpExpireAt }).save();
    return { otp };
  }

  async signinWithOtp(otp: string): Promise<gql.AccessToken> {
    const keyring = await this.Keyring.pickOne({ otp });
    if (keyring.isOtpExpired()) throw new Error("otp is expired.");
    return this.securityService.generateToken(keyring);
  }
  async signinWithAddress(networkId: Id, address: string): Promise<gql.AccessToken> {
    const wallet = await this.walletService.myWallet(networkId, address);
    const keyring =
      (await this.Keyring.findOne({ wallets: wallet._id })) ?? (await this.Keyring.create({ wallets: [wallet._id] }));
    return this.securityService.generateToken(keyring);
  }
  async signinWithPassword(accountId: string, password: string): Promise<gql.AccessToken> {
    const account = await this.Keyring.findOne({ accountId }).select({
      _id: true,
      status: true,
      role: true,
      password: true,
    });
    if (!account) throw new Error("Signin Failed");
    if (account.status !== "active" || !(await bcrypt.compare(password, account.password || "")))
      throw new Error("Signin Failed");
    const keyring = await this.Keyring.pickById(account._id);
    return this.securityService.generateToken(keyring);
  }
  async signupWithPassword(accountId: string, password: string): Promise<gql.AccessToken> {
    const account = await this.Keyring.findOne({ accountId, status: "active" }).select({
      status: true,
      role: true,
      password: true,
    });
    if (account) throw new Error(`The Account Already Exists`);
    const keyring = await new this.Keyring({ accountId, password }).save();
    return this.securityService.generateToken(keyring);
  }
  async changePassword(keyringId: Id, password: string, prevPassword: string): Promise<gql.AccessToken> {
    const account = await this.Keyring.findOne({ _id: keyringId, status: "active" }).select({
      status: true,
      role: true,
      password: true,
    });
    if (!account) throw new Error(`The Account does not exists`);
    if (account && !(await bcrypt.compare(prevPassword, account.password || ""))) throw new Error(`not match`);
    const keyring = await this.Keyring.pickAndWrite(keyringId, { password });
    return this.securityService.generateToken(keyring);
  }
  async resetPassword(accountId: string): Promise<boolean> {
    const account = await this.Keyring.findOne({ accountId, status: "active" });
    if (!account) throw new Error(`The Account does not exists`);
    else if (account.updatedAt.getTime() > Date.now() - 1000 * 60 * 3) throw new Error(`Retry after 3 minutes`);
    const password = (Math.random() + 1).toString(36).slice(2, 14);
    const keyring = await this.Keyring.pickAndWrite(account._id, { password });
    return this.mailerService.sendPasswordResetMail(accountId, password);
  }
  async remove(keyringId: Id): Promise<Keyring.Doc> {
    const keyring = await this.Keyring.pickById(keyringId);
    return await keyring.reset().merge({ status: "inactive" }).save();
  }
  async keyringsHasWallet(networkId: Id, address: string) {
    const wallet = await this.walletService.myWallet(networkId, address);
    return await this.Keyring.find({ wallets: wallet._id });
  }
  async addWallet(keyringId: Id, networkId: Id, address: string) {
    const wallet = await this.walletService.myWallet(networkId, address);
    const keyring = await this.Keyring.pickById(keyringId);
    const num = await this.Keyring.extinctWallet(wallet._id);
    this.logger.log(`${num} Keyrings removed for wallet(${wallet._id}) - ${address}`);
    await this.contractService.inventory(wallet);
    return await keyring.addWallet(wallet._id).save();
  }
  async removeWallet(keyringId: Id, walletId: Id, address: string) {
    const wallet = (await this.walletService.get(walletId)).check(address);
    const keyring = await this.Keyring.pickById(keyringId);
    return await keyring.removeWallet(wallet._id).save();
  }
  // async whoAmI(address: string, discordId?: string): Promise<db.Keyring.Doc> {
  //   const keyring =
  //     (await this.Keyring.findOne({
  //       $or: [{ address: address.toLowerCase() }, { sideAddresses: { $in: [address.toLowerCase()] } }],
  //     })) ??
  //     (await this.Keyring.create({
  //       address: address.toLowerCase(),
  //     }));

  //   let akamirs: string[] = (await this.akamirService.myAkamirs(keyring.address)).map((akamir) => akamir.address);
  //   for (const sideAddress of keyring.sideAddresses)
  //     akamirs = [...akamirs, ...(await this.akamirService.myAkamirs(sideAddress)).map((akamir) => akamir.address)];

  //   const isHolder = keyring.isVerifyWallet && akamirs.length > 0;

  //   if (discordId && !keyring.isVerifyWallet) {
  //     let walletVerifiedId: string;
  //     const u = await this.Keyring.findOne({ "discord.keyring.id": discordId, status: "active" });

  //     if (u) throw new Error("already registered discord account");
  //     // walletVerifiedId = await this.akamirBotService.addRole(discordId, "Wallet Verified");
  //     const member = await this.akamirBotService.keyring(discordId);
  //     if (member.roles.cache.has(this.akamirBotService.roleMap["Need Re-Verify  Go to #verify-wallet"]))
  //       await this.akamirBotService.removeRole(discordId, "Need Re-Verify  Go to #verify-wallet");

  //     try {
  //       const verifiedKeyring = await keyring
  //         .merge({
  //           isHolder,
  //           isVerifyWallet: member ? true : false,
  //           sideAddresses: keyring.sideAddresses ?? [],
  //           // discordImageUrl: member && member.avatarURL() ? member.avatarURL() : null,
  //           isOnline: member && member.presence && member.presence.status === "online" ? true : false,
  //           discord: member ? { ...member, keyring: { ...member.keyring } } : {},
  //         })
  //         .save();
  //       await this.akamirCoreBotService.sendMessageWithEmbed("verify-wallet-log", null, {
  //         // color: "AQUA",
  //         description: `지갑인증 완료 @${member.keyring.keyringname}#${member.keyring.discriminator}`,
  //       });

  //       return verifiedKeyring;
  //     } catch (error) {
  //       const member = await this.akamirBotService.keyring(discordId);
  //       await this.akamirCoreBotService.sendMessageWithEmbed("verify-wallet-log", null, {
  //         // color: "RED",
  //         description: `지갑인증 실패 @${member.keyring.keyringname}#${member.keyring.discriminator}\n\n error message :\n${error.message}`,
  //       });
  //       throw new Error(`verify wallet failed. error message : ${member.keyring.keyringname}${error}`);
  //     }
  //   }

  //   return keyring.merge({ isHolder }).save();
  // }
  // async registerKeyring(message: string, signAddress: string, data: gql.KeyringInput) {
  //   const address = await this.securityService.checkSignature(message, signAddress);
  //   const member = await this.akamirBotService.keyring(data.discordId);
  //   return await this.Keyring.create({
  //     ...data,
  //     address: address,
  //     discord: member ? { ...member, keyring: { ...member.keyring } } : {},
  //     isOnline: member && member.presence && member.presence.status === "online" ? true : false,
  //     discordImageUrl: member ? member.avatarURL() : undefined,
  //   });
  // }

  // async modifyKeyring(message: string, signAddress: string, data: gql.KeyringInput) {
  //   const address = await this.securityService.checkSignature(message, signAddress);
  //   const keyring = await this.Keyring.findOne({ $or: [{ address }, { sideAddresses: { $in: [address] } }] });
  //   if (!keyring) throw new Error("not found keyring.");
  //   const member = await this.akamirBotService.keyring(data.discordId);
  //   return await keyring
  //     .merge({
  //       ...data,
  //       discord: member ? { ...member, keyring: { ...member.keyring } } : { ...keyring.discord },
  //       isOnline: member && member.presence && member.presence.status === "online" ? true : false,
  //       // discordImageUrl: member ? member.avatarURL() : keyring.discordImageUrl,
  //     })
  //     .save();
  // }
  // async deleteKeyring(message: string, signAddress: string) {
  //   const address = await this.securityService.checkSignature(message, signAddress);

  //   const keyring = await this.Keyring.findOne({ address });
  //   if (!keyring) throw new Error("not found keyring.");
  //   return await keyring.delete();
  // }

  // async changeMainAddress(message: string, signAddress: string) {
  //   const address = await this.securityService.checkSignature(message, signAddress);
  //   const keyring = await this.Keyring.findOne({ sideAddresses: { $in: [address] } });
  //   if (!keyring) throw new Error("not found keyring.");
  //   const sideAdressIndex = keyring.sideAddresses.indexOf(address);
  //   const newSideAdress = keyring.sideAddresses.splice(sideAdressIndex, 1);
  //   return await keyring
  //     .merge({
  //       address,
  //       sideAddresses: [...newSideAdress, keyring.address],
  //     })
  //     .save();
  // }

  // async addWallet(address: string, message: string, signAddress: string) {
  //   const addAddress = await this.securityService.checkSignature(message, signAddress);
  //   const keyring = await this.Keyring.findOne({ address });

  //   if (!keyring) throw new Error("not found keyring.");
  //   return await keyring
  //     .merge({
  //       sideAddresses: [...keyring.sideAddresses, addAddress],
  //     })
  //     .save();
  // }
  // async signinKeyring(keyringId: string) {
  //   const keyring = await this.Keyring.pickById(keyringId);
  //   const token = jwt.sign({ _id: keyring._id, role: "keyring" }, secret);
  //   return { accessToken: token };
  // }

  // async onlineKeyrings(filterBot = true) {
  //   const keyrings = await this.akamirBotService.onlineKeyrings(filterBot);
  //   const onlineKeyrings = keyrings.map((u) => u.nickname && u.keyring.keyringname);

  //   return await this.Keyring.find({
  //     $or: [
  //       { "discord.nickname": { $in: onlineKeyrings } },
  //       { "discord.keyring.keyringname": { $in: onlineKeyrings } },
  //     ],
  //     isVerifyWallet: true,
  //     // isOnline: true,
  //   });
  // }

  // async verifyWallet(keyringId: string, discordId: string) {
  //   const keyring = await this.Keyring.pickById(keyringId);
  //   const walletVerifiedId = await this.akamirBotService.addRole(discordId, "Wallet Verified");
  //   const member = await this.akamirBotService.keyring(discordId);

  //   await keyring
  //     .merge({
  //       isVerifyWallet: true,
  //       isOnline: member && member.presence && member.presence.status === "online" ? true : false,
  //       discord:
  //         Object.keys(keyring.discord).length === 0
  //           ? { ...member, keyring: { ...member.keyring } }
  //           : { ...keyring.discord, _roles: [...keyring.discord._roles, walletVerifiedId] },
  //     })
  //     .save();

  //   return true;
  // }

  // async isActiveKeyring(address: string) {
  //   const keyring = await this.Keyring.findOne({ address, status: "active" });
  //   if (keyring) return true;
  //   return false;
  // }

  // async findVerifyWalletKeyrings() {
  //   return await this.Keyring.findOne({ isVerifyWallet: true, status: "active" });
  // }
  // async syncBeHolders(akamirs: string[]) {
  //   const beHolders = await this.Keyring.find({
  //     isVerifyWallet: true,
  //     status: "active",
  //     "discord._roles": { $nin: [this.akamirBotService.roleMap["a.k.a Holder"]] },
  //     $or: [{ address: { $in: akamirs } }],
  //   });
  //   for (const keyring of beHolders) {
  //     try {
  //       await this.akamirBotService.addRole(keyring.discord.keyring.id, "a.k.a Holder");
  //       await keyring.merge({ isHolder: true }).save();
  //       this.logger.log(`added holder : ${keyring.discord.keyring.keyringname}`);
  //     } catch (error) {
  //       this.logger.error(error, keyring.address);
  //     }
  //   }
  //   return beHolders;
  // }
  // async syncWasHolders(akamirs: string[]) {
  //   const wasHolders = await this.Keyring.find({
  //     isVerifyWallet: true,
  //     status: "active",
  //     "discord._roles": { $in: [this.akamirBotService.roleMap["a.k.a Holder"]] },
  //     $or: [{ address: { $nin: akamirs } }],
  //   });
  //   for (const keyring of wasHolders) {
  //     try {
  //       await this.akamirBotService.removeRole(keyring.discord.keyring.id, "a.k.a Holder");
  //       this.logger.log(`remove holder : ${keyring.discord.keyring.keyringname}`);
  //       await keyring.merge({ isHolder: false }).save();
  //     } catch (error) {
  //       this.logger.error(error, keyring.address);
  //     }
  //   }
  //   return wasHolders;
  // }
}
