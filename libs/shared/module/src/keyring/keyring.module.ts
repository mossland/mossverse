import { DynamicModule, Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Keyring from "./keyring.model";
import { KeyringService } from "./keyring.service";
import { KeyringResolver } from "./keyring.resolver";
import {
  NaverOauthStrategy,
  KakaoOauthStrategy,
  GithubOauthStrategy,
  GoogleOauthStrategy,
  FacebookOauthStrategy,
  AppleOauthStrategy,
} from "./keyring.authguard";
import { option } from "@shared/module";
import { JwtModule } from "@nestjs/jwt";
import { KeyringController } from "./keyring.controller";

@Global()
@Module({})
export class KeyringModule {
  static register(securityOption: option.SecurityOptions, envOption: option.EnvironmentOptions): DynamicModule {
    return {
      module: KeyringModule,
      imports: [
        MongooseModule.forFeatureAsync([{ name: Keyring.name, useFactory: Keyring.middleware(securityOption) }]),
        JwtModule.register({}),
      ],
      controllers: [KeyringController],
      providers: [
        { provide: "SECURITY_OPTIONS", useValue: securityOption },
        { provide: "ENVIRONMENT_OPTIONS", useValue: envOption },
        { provide: "GITHUB_CREDENTIAL", useValue: securityOption.sso.github },
        { provide: "FACEBOOK_CREDENTIAL", useValue: securityOption.sso.facebook },
        { provide: "KAKAO_CREDENTIAL", useValue: securityOption.sso.kakao },
        { provide: "NAVER_CREDENTIAL", useValue: securityOption.sso.naver },
        { provide: "GOOGLE_CREDENTIAL", useValue: securityOption.sso.google },
        { provide: "APPLE_CREDENTIAL", useValue: securityOption.sso.apple },
        KeyringService,
        KeyringResolver,
        ...(securityOption.sso.naver ? [NaverOauthStrategy] : []),
        ...(securityOption.sso.kakao ? [KakaoOauthStrategy] : []),
        ...(securityOption.sso.github ? [GithubOauthStrategy] : []),
        ...(securityOption.sso.google ? [GoogleOauthStrategy] : []),
        ...(securityOption.sso.facebook ? [FacebookOauthStrategy] : []),
        ...(securityOption.sso.apple ? [AppleOauthStrategy] : []),
      ],
      exports: [KeyringService],
    };
  }
}
