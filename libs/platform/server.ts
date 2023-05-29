import { DynamicModule } from "@nestjs/common";
import { ListingModule } from "./lib/listing/_server";
import { ModulesOptions } from "./lib/option";
import { PlatBatchModule, ScalarModule } from "./lib/_platform/_server";
import { RaffleModule } from "./lib/raffle/_server";
import { ReceiptModule } from "./lib/receipt/_server";
import { ShipInfoModule } from "./lib/shipInfo/_server";
import { SnapshotModule } from "./lib/snapshot/_server";
import { SummaryModule } from "./lib/summary/_server";
import { SurveyModule } from "./lib/survey/_server";
import { TradeModule } from "./lib/trade/_server";
import { UserModule } from "./lib/user/_server";
import { registerModules as registerSharedModules } from "@shared/server";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...(!isChild ? registerSharedModules(options, true) : []),
    ScalarModule,
    SurveyModule,
    ShipInfoModule,
    ListingModule,
    RaffleModule,
    ReceiptModule,
    TradeModule,
    SnapshotModule,
    UserModule.register(!isChild),
    SummaryModule.register(!isChild),
  ] as DynamicModule[];
  return modules;
};
export const registerBatches = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [PlatBatchModule as unknown as DynamicModule] as DynamicModule[];
  return modules;
};

export { environment } from "./env/environment";
export * as doc from "./lib/doc";
export * as option from "./lib/option";
export * as sample from "./lib/sample";
export * as emp from "./lib/emp";
export * as cnst from "./lib/cnst";
