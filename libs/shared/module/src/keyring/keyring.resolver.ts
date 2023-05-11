import { Resolver, Query, Mutation, Args, ID, ResolveField, Subscription, Parent } from "@nestjs/graphql";
import { KeyringService } from "./keyring.service";
import { Inject, UseGuards } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import {
  Allow,
  Account,
  Auth,
  BaseResolver,
  Id,
  Signature,
  RequiredAuth,
  RequiredSignature,
} from "@shared/util-server";
import * as gql from "../gql";
import * as db from "../db";
import { WalletService } from "../wallet/wallet.service";
import { ContractService } from "../contract/contract.service";
import { UserService } from "../user/user.service";
import { srv as external } from "@external/module";

@Resolver(() => gql.Keyring)
export class KeyringResolver extends BaseResolver(gql.Keyring, gql.KeyringInput, Allow.Admin, Allow.Admin, Allow.User) {
  constructor(
    private readonly keyringService: KeyringService,
    private readonly walletService: WalletService,
    private readonly contractService: ContractService,
    private readonly userService: UserService,
    private readonly cloudflareService: external.CloudflareService
  ) {
    super(keyringService);
  }
  @Query(() => gql.Keyring)
  async myKeyring(@RequiredAuth() account: Account) {
    return await this.keyringService.pick({ _id: account.keyring, status: "active" });
  }
  @Query(() => gql.User)
  @UseGuards(Allow.User)
  async whoAmI(@RequiredAuth() account: Account) {
    return await this.keyringService.whoAmI(new Id(account.keyring));
  }

  //*=================================================================*//
  //*====================== Wallet Signing Area ======================*//
  @Query(() => ID, { nullable: true })
  async getKeyringIdHasWallet(
    @Args({ name: "networkId", type: () => ID }) networkId: string,
    @RequiredSignature() address: string
  ) {
    return await this.keyringService.getKeyringIdHasWallet(new Id(networkId), address);
  }
  @Mutation(() => gql.Keyring)
  async signupWallet(
    @Args({ name: "networkId", type: () => ID }) networkId: string,
    @Args({ name: "keyringId", type: () => ID, nullable: true }) keyringId: string | null,
    @RequiredSignature() address: string
  ) {
    return await this.keyringService.signupWallet(new Id(networkId), keyringId ? new Id(keyringId) : null, address);
  }
  @Mutation(() => gql.AccessToken)
  async signinWallet(
    @Args({ name: "networkId", type: () => ID }) networkId: string,
    @RequiredSignature() address: string
  ) {
    return await this.keyringService.signinWallet(new Id(networkId), address);
  }
  @Mutation(() => gql.Keyring)
  @UseGuards(Allow.Every)
  async signaddWallet(
    @Args({ name: "networkId", type: () => ID }) networkId: string,
    @RequiredSignature() address: string,
    @RequiredAuth() account: Account
  ) {
    return await this.keyringService.signaddWallet(new Id(networkId), address, account.keyring);
  }
  @Mutation(() => gql.Keyring)
  @UseGuards(Allow.Every)
  async signsubWallet(@Args({ name: "walletId", type: () => ID }) walletId: string, @RequiredAuth() account: Account) {
    return await this.keyringService.signsubWallet(new Id(walletId), account.keyring);
  }
  //*====================== Wallet Signing Area ======================*//
  //*=================================================================*//

  //*===================================================================*//
  //*====================== Password Signing Area ======================*//
  @Query(() => ID, { nullable: true })
  async getKeyringIdHasAccountId(@Args({ name: "accountId", type: () => String }) accountId: string) {
    return await this.keyringService.getKeyringIdHasAccountId(accountId);
  }
  @Mutation(() => gql.Keyring)
  async signupPassword(
    @Args({ name: "accountId", type: () => String }) accountId: string,
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "token", type: () => String }) token: string,
    @Args({ name: "keyringId", type: () => ID, nullable: true }) keyringId: string | null
  ) {
    if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    return await this.keyringService.signupPassword(accountId, password, keyringId ? new Id(keyringId) : null);
  }
  @Mutation(() => gql.AccessToken)
  async signinPassword(
    @Args({ name: "accountId", type: () => String }) accountId: string,
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "token", type: () => String }) token: string
  ) {
    if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    return await this.keyringService.signinPassword(accountId, password);
  }
  @Mutation(() => gql.Keyring)
  @UseGuards(Allow.Every)
  async signaddPassword(
    @Args({ name: "accountId", type: () => String }) accountId: string,
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "token", type: () => String }) token: string,
    @RequiredAuth() account: Account
  ) {
    if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    return await this.keyringService.signaddPassword(accountId, password, account.keyring);
  }
  @Mutation(() => Boolean)
  @UseGuards(Allow.Every)
  async changePassword(
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "prevPassword", type: () => String }) prevPassword: string,
    @Args({ name: "token", type: () => String }) token: string,
    @RequiredAuth() account: Account
  ) {
    if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    await this.keyringService.changePassword(password, prevPassword, account.keyring);
    return true;
  }
  @Mutation(() => Boolean)
  @UseGuards(Allow.Every)
  async changePasswordWithPhone(
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string,
    @RequiredAuth() account: Account
  ) {
    await this.keyringService.changePasswordWithPhone(password, phone, phoneCode, account.keyring);
    return true;
  }
  @Mutation(() => Boolean)
  async resetPassword(@Args({ name: "accountId", type: () => String }) accountId: string) {
    return await this.keyringService.resetPassword(accountId);
  }
  //*====================== Password Signing Area ======================*//
  //*===================================================================*//

  //*================================================================*//
  //*====================== Phone Signing Area ======================*//
  @Query(() => ID, { nullable: true })
  async getKeyringIdHasPhone(@Args({ name: "phone", type: () => String }) phone: string) {
    return await this.keyringService.getKeyringIdHasPhone(phone);
  }
  @Mutation(() => gql.Keyring)
  async addPhoneInPrepareKeyring(
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "keyringId", type: () => ID, nullable: true }) keyringId: string | null
  ) {
    return await this.keyringService.addPhoneInPrepareKeyring(phone, keyringId ? new Id(keyringId) : null);
  }
  @Mutation(() => gql.Keyring)
  @UseGuards(Allow.User)
  async addPhoneInActiveKeyring(
    @Args({ name: "phone", type: () => String }) phone: string,
    @RequiredAuth() account: Account
  ) {
    return await this.keyringService.addPhoneInActiveKeyring(phone, account.keyring);
  }
  @Mutation(() => Date)
  async requestPhoneCode(
    @Args({ name: "keyringId", type: () => ID }) keyringId: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "hash", type: () => String }) hash: string
  ) {
    return await this.keyringService.requestPhoneCode(new Id(keyringId), phone, hash);
  }
  @Mutation(() => gql.Keyring)
  async verifyPhoneCode(
    @Args({ name: "keyringId", type: () => ID }) keyringId: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string
  ) {
    return await this.keyringService.verifyPhoneCode(new Id(keyringId), phone, phoneCode);
  }
  @Mutation(() => gql.Keyring)
  async signupPhone(
    @Args({ name: "keyringId", type: () => ID }) keyringId: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string
  ) {
    return await this.keyringService.signupPhone(new Id(keyringId), phone, phoneCode);
  }
  @Mutation(() => gql.AccessToken)
  async signinPhone(
    @Args({ name: "keyringId", type: () => ID }) keyringId: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string
  ) {
    return await this.keyringService.signinPhone(new Id(keyringId), phone, phoneCode);
  }
  @Mutation(() => gql.Keyring)
  @UseGuards(Allow.User)
  async signaddPhone(
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string,
    @RequiredAuth() account: Account
  ) {
    return await this.keyringService.signaddPhone(account.keyring, phone, phoneCode);
  }
  //*====================== Phone Signing Area ======================*//
  //*================================================================*//
  @Mutation(() => gql.Keyring)
  async activateUser(@Args({ name: "keyringId", type: () => ID }) keyringId: string) {
    return await this.keyringService.activateUser(new Id(keyringId));
  }
  @ResolveField(() => [gql.Wallet])
  async wallets(@Parent() keyring: gql.Keyring) {
    return await this.walletService.loadMany(keyring.wallets);
  }
  @ResolveField(() => [gql.Contract])
  async holds(@Parent() keyring: gql.Keyring) {
    return await this.contractService.loadMany(keyring.holds);
  }
}
