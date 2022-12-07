import { ModulesOptions as Options } from "@shared/util-server";
import { option as external } from "@external/module";
export interface EnvironmentOptions {
  // dir: string;
  srv: "script" | "serve" | "test";
  env: "local" | "debug" | "develop" | "main";
}
export interface SecurityOptions {
  aeskey: string;
  saltRounds: string;
  jwtSecret: string;
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
