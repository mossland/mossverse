import { ModulesOptions as Options } from "@shared/util-server";
import { option as external } from "@external/module";
export interface EnvironmentOptions {
  srv: "script" | "serve" | "test";
  env: "testing" | "testing.local" | "debug" | "debug.local" | "develop" | "develop.local" | "main" | "main.local";
  origin: string;
  serves: string[];
}

export const ssoTypes = ["github", "google", "facebook", "apple", "naver", "kakao"] as const;
export type SSOType = (typeof ssoTypes)[number];
export type SSOCredential = {
  clientID: string;
  clientSecret?: string; //apple의 경우 keypath
  callbackURL: string;
};
export type AppleCredential = SSOCredential & {
  teamID: string;
  keyID: string;
  keyFilePath: string;
};
export type SSOOptions = {
  [key in SSOType]?: SSOCredential | AppleCredential;
};
export interface SecurityOptions {
  aeskey: string;
  saltRounds: number;
  jwtSecret: string;
  verifies: ("wallet" | "password" | "phone" | "kakao" | "naver" | "email")[][];
  sso: SSOOptions;
}
export interface MongoOptions {
  uri: string;
  dbName: string;
  replSet?: string;
}
export type ModulesOptions = Options &
  external.ModulesOptions & {
    environment: EnvironmentOptions;
    security: SecurityOptions;
    mongo: MongoOptions;
  };
