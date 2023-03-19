import { JwtService } from "@nestjs/jwt";
import { Profile as GitProfile, Strategy as GithubStrategy } from "passport-github";
import { Profile as GoogleProfile, Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Profile as FacebookProfile, Strategy as FacebookStrategy } from "passport-facebook";
import { Profile as AppleProfile, Strategy as AppleStrategy } from "passport-apple";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { Strategy as NaverStrategy } from "passport-naver";
import { AppleCredential, SecurityOptions, SSOCredential } from "../option";
import { Inject, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class KakaoOauthStrategy extends PassportStrategy(KakaoStrategy, "kakao") {
  constructor(@Inject("KAKAO_CREDENTIAL") private readonly sso: SSOCredential) {
    super({ ...sso, scope: ["account_email", "profile_nickname"] });
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
  constructor(@Inject("NAVER_CREDENTIAL") private readonly sso: SSOCredential) {
    super({ ...sso });
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
  constructor(@Inject("GITHUB_CREDENTIAL") private readonly sso: SSOCredential) {
    super({ ...sso, scope: ["user"] });
  }

  async validate(accessToken: string, _refreshToken: string, profile: GitProfile) {
    return profile;
  }
}

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(GoogleStrategy, "google") {
  constructor(@Inject("GOOGLE_CREDENTIAL") private readonly sso: SSOCredential) {
    super({ ...sso, scope: ["email", "profile"] });
  }
  async validate(_accessToken: string, _refreshToken: string, profile: GoogleProfile) {
    return profile;
  }
}

@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(FacebookStrategy, "facebook") {
  constructor(@Inject("FACEBOOK_CREDENTIAL") private readonly sso: SSOCredential) {
    super({ ...sso, scope: ["email"], profileFields: ["emails", "name"] });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: FacebookProfile) {
    return profile;
  }
}

@Injectable()
export class AppleOauthStrategy extends PassportStrategy(AppleStrategy, "apple") {
  constructor(@Inject("APPLE_CREDENTIAL") private readonly sso: AppleCredential) {
    super({ ...sso, passReqToCallback: true, scope: ["name", "email"] });
  }
  async validate(req, accessToken: string, refreshToken: string, idToken: string, profile: AppleProfile, cb) {
    cb(null, idToken);
  }
}
