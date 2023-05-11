import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  UseGuards,
  Inject,
  Injectable,
  Body,
  ForbiddenException,
} from "@nestjs/common";
import * as appleSignin from "apple-signin";
import type { Request, Response } from "express";
import { KeyringService } from "./keyring.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import * as gql from "../gql";
import { AppleCredential, EnvironmentOptions, SecurityOptions } from "../option";
// import { AuthGuard } from "@nestjs/passport";
import { KakaoGuard, NaverGuard } from "./keyring.authguard";
import { AuthGuard } from "@nestjs/passport";
import * as jwt from "jsonwebtoken";
interface RequestUser extends Request {
  user: {
    name?: string;
    email: string;
  };
}
@Injectable()
@ApiTags("auth")
@Controller("auth")
export class KeyringController {
  url: string;
  constructor(
    @Inject("ENVIRONMENT_OPTIONS") private readonly options: EnvironmentOptions,
    @Inject("SECURITY_OPTIONS") private readonly securityOption: SecurityOptions,
    private readonly keyringService: KeyringService
  ) {
    this.url = options.serves.includes("localhost") ? "http://localhost:4200" : `https://${this.options.serves[0]}`;
  }

  @Get("github")
  @UseGuards(AuthGuard("github"))
  async loginGithub() {
    return "logging in with github...";
  }
  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  async authCallbackGithub(@Req() req) {
    console.log(req.user);
    return req.user;
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async loginGoogle() {
    return "logging in with google...";
  }
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async authCallbackGoogle(@Req() req) {
    console.log(req.user);
    return req.user;
  }

  @Get("facebook")
  @UseGuards(AuthGuard("facebook"))
  async loginFacebook() {
    return "logging in with facebook...";
  }
  @Get("facebook/callback")
  @UseGuards(AuthGuard("facebook"))
  async authCallbackFacebook(@Req() req) {
    console.log(req.user);
    return req.user;
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
      redirectUri: sso.callbackURL,
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
    const [keyring] = await this.keyringService.list({ accountId: req.user.email, status: { $ne: "inactive" } });
    if (!keyring || keyring?.status === "prepare") {
      const signupKeyring = await this.keyringService.signupSso(req.user.email, "kakao", keyring?._id);
      const accessToken = await this.keyringService.generateToken(signupKeyring);
      res.cookie("signupKeyring", signupKeyring, { httpOnly: false }); //추후에 true로 바꿔야함
      res.cookie("accessToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}/signup?ssoType=kakao`);
    } else if (!keyring.verifies.includes("kakao")) {
      const myKeyring = await this.keyringService.signaddSso(keyring.id, req.user.email, "kakao");
      const accessToken = await this.keyringService.generateToken(myKeyring);
      res.cookie("accessToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}`);
    } else {
      const accessToken = await this.keyringService.signinSso(req.user.email, "kakao");
      res.cookie("accessToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
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
    const [keyring] = await this.keyringService.list({ accountId: req.user.email, status: { $ne: "inactive" } });
    if (!keyring || keyring?.status === "prepare") {
      const signupKeyring = await this.keyringService.signupSso(req.user.email, "naver", keyring?._id);
      const accessToken = await this.keyringService.generateToken(signupKeyring);
      res.cookie("signupKeyring", signupKeyring, { httpOnly: false }); //추후에 true로 바꿔야함
      res.cookie("accessToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}/signup?ssoType=naver`);
    } else if (!keyring.verifies.includes("naver")) {
      const myKeyring = await this.keyringService.signaddSso(keyring.id, req.user.email, "naver");
      const accessToken = await this.keyringService.generateToken(myKeyring);
      res.cookie("accessToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}`);
    } else {
      const accessToken = await this.keyringService.signinSso(req.user.email, "naver");
      res.cookie("accessToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${this.url}`);
    }
  }
}
