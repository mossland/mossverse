import * as decentverse from "@decentverse/server";
import * as platform from "@platform/server";
import * as shared from "@shared/server";
import * as social from "@social/server";
import { AdvertiseModule } from "./lib/advertise/_server";
import { BatchModule, ScalarModule } from "./lib/_mossland/_server";
import { DynamicModule, Global, Module } from "@nestjs/common";
import { LuniverseModule } from "./lib/luniverse/_server";
import { MocSurveyModule } from "./lib/mocSurvey/_server";
import { MocWalletModule } from "./lib/mocWallet/_server";
import { ModulesOptions } from "./lib/option";
import { NestFactory } from "@nestjs/core";
import { PointModule } from "./lib/point/_server";
import { SkinManagerModule } from "./lib/skinManager/_server";
import { StakePoolModule } from "./lib/stakePool/_server";
import { SummaryModule } from "./lib/summary/_server";
import { UserModule } from "./lib/user/_server";
import { boot, bootBatch } from "@util/server";
import { environment } from "./env/environment";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...shared.registerModules(options, true),
    ...social.registerModules(options, true),
    ...platform.registerModules(options, true),
    ...decentverse.registerModules(options, true),
    ScalarModule,
    LuniverseModule.register(options.mossland),
    PointModule,
    MocWalletModule,
    MocSurveyModule,
    StakePoolModule,
    AdvertiseModule,
    SkinManagerModule,
    SummaryModule.register(!isChild),
    UserModule.register(!isChild),
  ].filter((module) => !!module) as DynamicModule[];
  return modules;
};
export const registerBatches = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...shared.registerBatches(options, true),
    ...social.registerBatches(options, true),
    ...platform.registerBatches(options, true),
    ...decentverse.registerBatches(options, true),
    BatchModule,
  ].filter((module) => !!module) as DynamicModule[];
  return modules;
};

@Global()
@Module({})
export class AppModule {
  static register(options: ModulesOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [...registerModules(options)],
      controllers: [],
      providers: [],
    };
  }
}

@Global()
@Module({})
export class BatchAppModule {
  static register(options: ModulesOptions): DynamicModule {
    return {
      module: BatchAppModule,
      imports: [...registerModules(options), ...registerBatches(options)],
      controllers: [],
      providers: [],
    };
  }
}

const bootstrap = async () => {
  const serverMode = process.env.SERVER_MODE as "federation" | "batch" | "all" | null;
  if (serverMode === "federation") {
    const app = await NestFactory.create(AppModule.register(environment));
    await boot(app, environment);
  } else if (serverMode === "batch") {
    const app = await NestFactory.create(BatchAppModule.register(environment));
    await bootBatch(app, environment);
  } else if (serverMode === "all") {
    const app = await NestFactory.create(BatchAppModule.register(environment));
    await boot(app, environment);
  } else throw new Error("SERVER_MODE environment variable is not defined");
};
bootstrap();
