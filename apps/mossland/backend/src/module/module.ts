import { module as shared } from "@shared/module";
import { module as platform } from "@platform/module";
import { module as decentverse } from "@decentverse/module";
import { ModulesOptions } from "./option";
import { DynamicModule } from "@nestjs/common";

import { LuniverseModule } from "./luniverse/luniverse.module";
import { BatchModule } from "./batch/batch.module";
import { PointModule } from "./point/point.module";
import { MocWalletModule } from "./mocWallet/mocWallet.module";
import { MocSurveyModule } from "./mocSurvey/mocSurvey.module";
import { UserModule } from "./user/user.module";
// import { ScalarModule } from "./_scalar/scalar.module";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...shared.registerModules(options, true),
    ...platform.registerModules(options, true),
    ...decentverse.registerModules(options, true),
    // ScalarModule,
    UserModule.register(!isChild),
    LuniverseModule.register(options.mossland),
    PointModule,
    MocWalletModule,
    MocSurveyModule,
  ].filter((module) => !!module) as DynamicModule[];
  return modules;
};
export const registerBatches = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...shared.registerBatches(options, true),
    ...platform.registerBatches(options, true),
    ...decentverse.registerBatches(options, true),
    BatchModule,
  ].filter((module) => !!module) as DynamicModule[];
  return modules;
};
