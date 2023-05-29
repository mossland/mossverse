import * as appleSignin from "apple-signin";
import * as cnst from "../cnst";
import * as jwt from "jsonwebtoken";
import { Account, Allow, BaseResolver, Id, RequiredAuth, RequiredSignature } from "@util/server";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Profile as AppleProfile, Strategy as AppleStrategy } from "passport-apple";
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Injectable,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ContractEmployee } from "../contract/contract.employee";
import { Profile as FacebookProfile, Strategy as FacebookStrategy } from "passport-facebook";
import { Profile as GitProfile, Strategy as GithubStrategy } from "passport-github";
import { Profile as GoogleProfile, Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { KeyringEmployee } from "./keyring.employee";
import { Strategy as NaverStrategy } from "passport-naver";
import { UserEmployee } from "../user/user.employee";
import { WalletEmployee } from "../wallet/wallet.employee";
import { emp as external } from "@external/server";
import type { AppleCredential, EnvironmentOptions, SSOCredential, SecurityOptions } from "../option";
import type { Request, Response } from "express";

@Resolver(() => cnst.Keyring)
export class KeyringResolver extends BaseResolver(
  cnst.Keyring,
  cnst.KeyringInput,
  Allow.Admin,
  Allow.Admin,
  Allow.User
) {
  constructor(
    private readonly keyringEmployee: KeyringEmployee,
    private readonly walletEmployee: WalletEmployee,
    private readonly contractEmployee: ContractEmployee,
    private readonly userEmployee: UserEmployee,
    private readonly cloudflareEmployee: external.CloudflareEmployee
  ) {
    super(keyringEmployee);
  }
  @Query(() => cnst.Keyring)
  async myKeyring(@RequiredAuth() account: Account) {
    return await this.keyringEmployee.pick({
      _id: account.keyring,
      status: "active",
    });
  }
  @Query(() => cnst.User)
  @UseGuards(Allow.User)
  async whoAmI(@RequiredAuth() account: Account) {
    return await this.keyringEmployee.whoAmI(new Id(account.keyring));
  }

  //*=================================================================*//
  //*====================== Wallet Signing Area ======================*//
  @Query(() => ID, { nullable: true })
  async getKeyringIdHasWallet(
    @Args({ name: "networkId", type: () => ID }) networkId: string,
    @RequiredSignature() address: string
  ) {
    return await this.keyringEmployee.getKeyringIdHasWallet(new Id(networkId), address);
  }
  @Mutation(() => cnst.Keyring)
  async signupWallet(
    @Args({ name: "networkId", type: () => ID }) networkId: string,
    @Args({ name: "keyringId", type: () => ID, nullable: true })
    keyringId: string | null,
    @RequiredSignature() address: string
  ) {
    return await this.keyringEmployee.signupWallet(new Id(networkId), keyringId ? new Id(keyringId) : null, address);
  }
  @Mutation(() => cnst.AccessToken)
  async signinWallet(
    @Args({ name: "networkId", type: () => ID }) networkId: string,
    @RequiredSignature() address: string
  ) {
    const accessToken = await this.keyringEmployee.signinWallet(new Id(networkId), address);
    return accessToken;
  }
  @Mutation(() => cnst.Keyring)
  @UseGuards(Allow.Every)
  async signaddWallet(
    @Args({ name: "networkId", type: () => ID }) networkId: string,
    @RequiredSignature() address: string,
    @RequiredAuth() account: Account
  ) {
    return await this.keyringEmployee.signaddWallet(new Id(networkId), address, account.keyring);
  }
  @Mutation(() => cnst.Keyring)
  @UseGuards(Allow.Every)
  async signsubWallet(@Args({ name: "walletId", type: () => ID }) walletId: string, @RequiredAuth() account: Account) {
    return await this.keyringEmployee.signsubWallet(new Id(walletId), account.keyring);
  }
  //*====================== Wallet Signing Area ======================*//
  //*=================================================================*//

  //*===================================================================*//
  //*====================== Password Signing Area ======================*//
  @Query(() => ID, { nullable: true })
  async getKeyringIdHasAccountId(@Args({ name: "accountId", type: () => String }) accountId: string) {
    return await this.keyringEmployee.getKeyringIdHasAccountId(accountId);
  }
  @Mutation(() => cnst.Keyring)
  async signupPassword(
    @Args({ name: "accountId", type: () => String }) accountId: string,
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "token", type: () => String }) token: string,
    @Args({ name: "keyringId", type: () => ID, nullable: true })
    keyringId: string | null
  ) {
    //! 임시 비활
    // if (!(await this.cloudflareEmployee.isVerified(token))) throw new Error("Invalid Turnstile Token");
    return await this.keyringEmployee.signupPassword(accountId, password, keyringId ? new Id(keyringId) : null);
  }
  @Mutation(() => cnst.AccessToken)
  async signinPassword(
    @Args({ name: "accountId", type: () => String }) accountId: string,
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "token", type: () => String }) token: string
  ) {
    //! 임시 비활
    //if (!(await this.cloudflareEmployee.isVerified(token))) throw new Error("Invalid Turnstile Token");
    const accessToken = await this.keyringEmployee.signinPassword(accountId, password);
    return accessToken;
  }
  @Mutation(() => cnst.Keyring)
  @UseGuards(Allow.Every)
  async signaddPassword(
    @Args({ name: "accountId", type: () => String }) accountId: string,
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "token", type: () => String }) token: string,
    @RequiredAuth() account: Account
  ) {
    if (!(await this.cloudflareEmployee.isVerified(token))) throw new Error("Invalid Turnstile Token");
    return await this.keyringEmployee.signaddPassword(accountId, password, account.keyring);
  }
  @Mutation(() => Boolean)
  @UseGuards(Allow.Every)
  async changePassword(
    @Args({ name: "password", type: () => String }) password: string,
    @Args({ name: "prevPassword", type: () => String }) prevPassword: string,
    @Args({ name: "token", type: () => String }) token: string,
    @RequiredAuth() account: Account
  ) {
    if (!(await this.cloudflareEmployee.isVerified(token))) throw new Error("Invalid Turnstile Token");
    await this.keyringEmployee.changePassword(password, prevPassword, account.keyring);
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
    await this.keyringEmployee.changePasswordWithPhone(password, phone, phoneCode, account.keyring);
    return true;
  }
  @Mutation(() => Boolean)
  async resetPassword(@Args({ name: "accountId", type: () => String }) accountId: string) {
    return await this.keyringEmployee.resetPassword(accountId);
  }
  //*====================== Password Signing Area ======================*//
  //*===================================================================*//

  //*================================================================*//
  //*====================== Phone Signing Area ======================*//
  @Query(() => ID, { nullable: true })
  async getKeyringIdHasPhone(@Args({ name: "phone", type: () => String }) phone: string) {
    return await this.keyringEmployee.getKeyringIdHasPhone(phone);
  }
  @Mutation(() => cnst.Keyring)
  async addPhoneInPrepareKeyring(
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "keyringId", type: () => ID, nullable: true })
    keyringId: string | null
  ) {
    return await this.keyringEmployee.addPhoneInPrepareKeyring(phone, keyringId ? new Id(keyringId) : null);
  }
  @Mutation(() => cnst.Keyring)
  @UseGuards(Allow.User)
  async addPhoneInActiveKeyring(
    @Args({ name: "phone", type: () => String }) phone: string,
    @RequiredAuth() account: Account
  ) {
    return await this.keyringEmployee.addPhoneInActiveKeyring(phone, account.keyring);
  }
  @Mutation(() => Date)
  async requestPhoneCode(
    @Args({ name: "keyringId", type: () => ID }) keyringId: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "hash", type: () => String }) hash: string
  ) {
    return await this.keyringEmployee.requestPhoneCode(new Id(keyringId), phone, hash);
  }
  @Mutation(() => cnst.Keyring)
  async verifyPhoneCode(
    @Args({ name: "keyringId", type: () => ID }) keyringId: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string
  ) {
    return await this.keyringEmployee.verifyPhoneCode(new Id(keyringId), phone, phoneCode);
  }
  @Mutation(() => cnst.Keyring)
  async signupPhone(
    @Args({ name: "keyringId", type: () => ID }) keyringId: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string
  ) {
    return await this.keyringEmployee.signupPhone(new Id(keyringId), phone, phoneCode);
  }
  @Mutation(() => cnst.AccessToken)
  async signinPhone(
    @Args({ name: "keyringId", type: () => ID }) keyringId: string,
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string
  ) {
    const accessToken = await this.keyringEmployee.signinPhone(new Id(keyringId), phone, phoneCode);
    return accessToken;
  }
  @Mutation(() => cnst.Keyring)
  @UseGuards(Allow.User)
  async signaddPhone(
    @Args({ name: "phone", type: () => String }) phone: string,
    @Args({ name: "phoneCode", type: () => String }) phoneCode: string,
    @RequiredAuth() account: Account
  ) {
    return await this.keyringEmployee.signaddPhone(account.keyring, phone, phoneCode);
  }
  //*====================== Phone Signing Area ======================*//
  //*================================================================*//
  @Mutation(() => cnst.Keyring)
  async activateUser(@Args({ name: "keyringId", type: () => ID }) keyringId: string) {
    return await this.keyringEmployee.activateUser(new Id(keyringId));
  }
  @ResolveField(() => [cnst.Wallet])
  async wallets(@Parent() keyring: cnst.Keyring) {
    return await this.walletEmployee.loadMany(keyring.wallets);
  }
  @ResolveField(() => [cnst.Contract])
  async holds(@Parent() keyring: cnst.Keyring) {
    return await this.contractEmployee.loadMany(keyring.holds);
  }
}
@Injectable()
export class KakaoOauthStrategy extends PassportStrategy(KakaoStrategy, "kakao") {
  constructor(
    @Inject("ENVIRONMENT_OPTIONS") private readonly env: EnvironmentOptions,
    @Inject("KAKAO_CREDENTIAL") private readonly sso: SSOCredential
  ) {
    super({ ...sso, callbackURL: `${env.origin}/auth/kakao/callback`, scope: ["account_email", "profile_nickname"] });
  }

  async validate(jwt: string, refreshToken: string, profile: any) {
    return {
      name: profile.displayName,
      email: profile._json.kakao_account.email,
      password: profile.id,
    };
  }
}

@Injectable()
export class NaverOauthStrategy extends PassportStrategy(NaverStrategy, "naver") {
  constructor(
    @Inject("ENVIRONMENT_OPTIONS") private readonly env: EnvironmentOptions,
    @Inject("NAVER_CREDENTIAL") private readonly sso: SSOCredential
  ) {
    super({ ...sso, callbackURL: `${env.origin}/auth/naver/callback` });
  }
  validate(jwt: string, refreshToken: string, profile: any) {
    return {
      name: profile.displayName,
      email: profile._json.email,
      password: profile.id,
    };
  }
}

@Injectable()
export class KakaoGuard extends AuthGuard("kakao") {}

@Injectable()
export class NaverGuard extends AuthGuard("naver") {}

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(GithubStrategy, "github") {
  constructor(
    @Inject("ENVIRONMENT_OPTIONS") private readonly env: EnvironmentOptions,
    @Inject("GITHUB_CREDENTIAL") private readonly sso: SSOCredential
  ) {
    super({ ...sso, callbackURL: `${env.origin}/auth/github/callback`, scope: ["user"] });
  }

  async validate(accessToken: string, _refreshToken: string, profile: GitProfile) {
    return profile;
  }
}

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(GoogleStrategy, "google") {
  constructor(
    @Inject("ENVIRONMENT_OPTIONS") private readonly env: EnvironmentOptions,
    @Inject("GOOGLE_CREDENTIAL") private readonly sso: SSOCredential
  ) {
    super({ ...sso, callbackURL: `${env.origin}/auth/google/callback`, scope: ["email", "profile"] });
  }
  async validate(_accessToken: string, _refreshToken: string, profile: GoogleProfile) {
    return profile;
  }
}

@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(FacebookStrategy, "facebook") {
  constructor(
    @Inject("ENVIRONMENT_OPTIONS") private readonly env: EnvironmentOptions,
    @Inject("FACEBOOK_CREDENTIAL") private readonly sso: SSOCredential
  ) {
    super({
      ...sso,
      callbackURL: `${env.origin}/auth/facebook/callback`,
      scope: ["email"],
      profileFields: ["emails", "name"],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: FacebookProfile) {
    return profile;
  }
}

@Injectable()
export class AppleOauthStrategy extends PassportStrategy(AppleStrategy, "apple") {
  constructor(
    @Inject("ENVIRONMENT_OPTIONS") private readonly env: EnvironmentOptions,
    @Inject("APPLE_CREDENTIAL") private readonly sso: AppleCredential
  ) {
    super({
      ...sso,
      callbackURL: `${env.origin}/auth/apple/callback`,
      passReqToCallback: true,
      scope: ["name", "email"],
    });
  }
  async validate(req, accessToken: string, refreshToken: string, idToken: string, profile: AppleProfile, cb) {
    cb(null, idToken);
  }
}

interface RequestUser extends Request {
  user: {
    name?: string;
    email: string;
  };
}
type GithubResponse = {
  id: string;
  displayName: string;
  username: string;
  profileUrl: string;
  photos: { value: string }[];
};
type GoogleResponse = {
  id: string;
  displayName: string;
  name: { familyName: string; givenName: string };
  emails: { value: string; verified: boolean }[];
  photos: { value: string }[];
};
type FacebookResponse = {
  id: string;
  name: { familyName: string; givenName: string };
  emails: { value: string; verified: boolean }[];
};

@Injectable()
@ApiTags("auth")
@Controller("auth")
export class KeyringController {
  url: string;
  constructor(
    @Inject("ENVIRONMENT_OPTIONS") private readonly options: EnvironmentOptions,
    @Inject("SECURITY_OPTIONS")
    private readonly securityOption: SecurityOptions,
    private readonly keyringEmployee: KeyringEmployee
  ) {
    this.url = options.serves.every((s) => s === "localhost")
      ? "http://localhost:4200"
      : `https://${this.options.serves[0]}`;
  }

  @Get("hello")
  async hello() {
    return "hello";
  }

  @Get("github")
  @UseGuards(AuthGuard("github"))
  async loginGithub() {
    return "logging in with github...";
  }
  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  async authCallbackGithub(@Req() req: any, @Res() res: Response) {
    const user = req.user as GithubResponse;
    const [keyring] = await this.keyringEmployee.list({ accountId: user.username, status: { $ne: "inactive" } });
    if (!keyring || keyring?.status === "prepare") {
      const signupKeyring = await this.keyringEmployee.signupSso(user.username, "kakao", keyring?._id);
      const accessToken = await this.keyringEmployee.generateToken(signupKeyring);
      res.cookie("signupKeyring", signupKeyring, { httpOnly: false }); //추후에 true로 바꿔야함
      res.cookie("signupToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}/signup?ssoType=github`);
    } else if (!keyring.verifies.includes("kakao")) {
      const myKeyring = await this.keyringEmployee.signaddSso(keyring.id, user.username, "kakao");
      const accessToken = await this.keyringEmployee.generateToken(myKeyring);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}`);
    } else {
      const accessToken = await this.keyringEmployee.signinSso(user.username, "kakao");
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}`);
    }
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async loginGoogle() {
    return "logging in with google...";
  }
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async authCallbackGoogle(@Req() req: any, @Res() res: Response) {
    const user = req.user as GoogleResponse;
    const [keyring] = await this.keyringEmployee.list({ accountId: user.emails[0].value, status: { $ne: "inactive" } });
    if (!keyring || keyring?.status === "prepare") {
      const signupKeyring = await this.keyringEmployee.signupSso(user.emails[0].value, "kakao", keyring?._id);
      const accessToken = await this.keyringEmployee.generateToken(signupKeyring);
      res.cookie("signupKeyring", signupKeyring, { httpOnly: false }); //추후에 true로 바꿔야함
      res.cookie("signupToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}/signup?ssoType=google`);
    } else if (!keyring.verifies.includes("kakao")) {
      const myKeyring = await this.keyringEmployee.signaddSso(keyring.id, user.emails[0].value, "kakao");
      const accessToken = await this.keyringEmployee.generateToken(myKeyring);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}`);
    } else {
      const accessToken = await this.keyringEmployee.signinSso(user.emails[0].value, "kakao");
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}`);
    }
  }

  @Get("facebook")
  @UseGuards(AuthGuard("facebook"))
  async loginFacebook() {
    return "logging in with facebook...";
  }
  @Get("facebook/callback")
  @UseGuards(AuthGuard("facebook"))
  async authCallbackFacebook(@Req() req: any, @Res() res: Response) {
    const user = req.user as FacebookResponse;
    const [keyring] = await this.keyringEmployee.list({ accountId: user.emails[0].value, status: { $ne: "inactive" } });
    if (!keyring || keyring?.status === "prepare") {
      const signupKeyring = await this.keyringEmployee.signupSso(user.emails[0].value, "kakao", keyring?._id);
      const accessToken = await this.keyringEmployee.generateToken(signupKeyring);
      res.cookie("signupKeyring", signupKeyring, { httpOnly: false }); //추후에 true로 바꿔야함
      res.cookie("signupToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}/signup?ssoType=facebook`);
    } else if (!keyring.verifies.includes("kakao")) {
      const myKeyring = await this.keyringEmployee.signaddSso(keyring.id, user.emails[0].value, "kakao");
      const accessToken = await this.keyringEmployee.generateToken(myKeyring);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}`);
    } else {
      const accessToken = await this.keyringEmployee.signinSso(user.emails[0].value, "kakao");
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}`);
    }
  }

  @Get("apple")
  @UseGuards(AuthGuard("apple"))
  async loginApple() {
    return "logging in with Apple...";
  }
  @Post("apple/callback")
  async appleLogin(@Body() payload: any): Promise<any> {
    console.log("Received", payload);
    if (!payload.code) {
      throw new ForbiddenException();
    }
    return this.verifyAppleUser(payload);
  }

  async verifyAppleUser(payload: any) {
    const sso = this.securityOption.sso.apple as AppleCredential;
    const clientSecret = appleSignin.getClientSecret({
      clientID: sso.clientID,
      teamId: sso.teamID,
      keyIdentifier: sso.keyID,
      privateKeyPath: sso.keyFilePath,
    });
    const tokens = await appleSignin.getAuthorizationToken(payload.code, {
      clientID: sso.clientID,
      clientSecret: clientSecret,
      redirectUri: `${this.options.origin}/auth/apple/callback`,
    });
    if (!tokens.id_token) {
      console.log("no token.id_token");
      throw new ForbiddenException();
    }
    console.log("tokens", tokens);
    const data = jwt.decode(tokens.id_token);
    console.log("decoded", data);
    return { tokens, data };
  }

  @Get("kakao")
  @UseGuards(KakaoGuard)
  @ApiOperation({
    summary: "Redirect Kakao SSO Login Page",
    description: "redirect to kakao login page",
  })
  async loginKakao() {
    return;
  }

  @Get("kakao/callback")
  @UseGuards(KakaoGuard)
  @ApiOperation({
    summary: "Get Kakao Information From Secret Token",
    description: "put JWT token in to cookie & redirect to main page",
  })
  async getTokenFromKakao(@Req() req: RequestUser, @Res() res: Response) {
    const [keyring] = await this.keyringEmployee.list({
      accountId: req.user.email,
      status: { $ne: "inactive" },
    });
    if (!keyring || keyring?.status === "prepare") {
      const signupKeyring = await this.keyringEmployee.signupSso(req.user.email, "kakao", keyring?._id);
      const accessToken = await this.keyringEmployee.generateToken(signupKeyring);
      res.cookie("signupKeyring", signupKeyring, { httpOnly: false }); //추후에 true로 바꿔야함
      res.cookie("signupToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}/signup?ssoType=kakao`);
    } else if (!keyring.verifies.includes("kakao")) {
      const myKeyring = await this.keyringEmployee.signaddSso(keyring.id, req.user.email, "kakao");
      const accessToken = await this.keyringEmployee.generateToken(myKeyring);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}`);
    } else {
      const accessToken = await this.keyringEmployee.signinSso(req.user.email, "kakao");
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}`);
    }
  }

  @Get("naver")
  @UseGuards(NaverGuard)
  @ApiOperation({
    summary: "Redirect Naver SSO Login Page",
    description: "redirect to Naver login page",
  })
  async loginNaver() {
    return;
  }

  @Get("naver/callback")
  @UseGuards(NaverGuard)
  @ApiOperation({
    summary: "Get Naver Information From Secret Token",
    description: "put JWT token in to cookie & redirect to main page",
  })
  async getTokenFromNaver(@Req() req: RequestUser, @Res() res: Response) {
    const [keyring] = await this.keyringEmployee.list({
      accountId: req.user.email,
      status: { $ne: "inactive" },
    });
    if (!keyring || keyring?.status === "prepare") {
      const signupKeyring = await this.keyringEmployee.signupSso(req.user.email, "naver", keyring?._id);
      const accessToken = await this.keyringEmployee.generateToken(signupKeyring);
      res.cookie("signupKeyring", signupKeyring, { httpOnly: false }); //추후에 true로 바꿔야함
      res.cookie("signupToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}/signup?ssoType=naver`);
    } else if (!keyring.verifies.includes("naver")) {
      const myKeyring = await this.keyringEmployee.signaddSso(keyring.id, req.user.email, "naver");
      const accessToken = await this.keyringEmployee.generateToken(myKeyring);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}`);
    } else {
      const accessToken = await this.keyringEmployee.signinSso(req.user.email, "naver");
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}`);
    }
  }
}
