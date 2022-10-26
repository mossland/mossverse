import { modules as shared } from "@shared/module";
import { modules as platform } from "@platform/module";
import { modules as decentverse } from "@decentverse/server";
import { ModulesOptions } from "./options";
import { DynamicModule } from "@nestjs/common";

import { LuniverseModule } from "./luniverse/luniverse.module";
import { BatchModule } from "./batch/batch.module";
import { PointModule } from "./point/point.module";
import { MocWalletModule } from "./mocWallet/mocWallet.module";
import { MocSurveyModule } from "./mocSurvey/mocSurvey.module";
import { UserModule } from "./user/user.module";
// import { ScalarModule } from "./__scalar/scalar.module";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...shared.registerModules(options, true),
    ...platform.registerModules(options, true),
    ...decentverse.registerModules(options, true),
    // ScalarModule,
    UserModule.register(!isChild),
    LuniverseModule.register(options.mossland),
    BatchModule,
    PointModule,
    MocWalletModule,
    MocSurveyModule,
  ].filter((module) => !!module) as DynamicModule[];
  return modules;
};
