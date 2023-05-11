import { module as shared } from "@shared/module";
import { ModulesOptions } from "./option";
import { DynamicModule } from "@nestjs/common";
import { SurveyModule } from "./survey/survey.module";
import { ShipInfoModule } from "./shipInfo/shipInfo.module";
import { TradeModule } from "./trade/trade.module";
import { ListingModule } from "./listing/listing.module";
import { ReceiptModule } from "./receipt/receipt.module";
import { ScalarModule } from "./_scalar/scalar.module";
import { PlatBatchModule } from "./platBatch/platBatch.module";
import { UserModule } from "./user/user.module";
import { RaffleModule } from "./raffle/raffle.module";
import { SummaryModule } from "./summary/summary.module";
import { SnapshotModule } from "./snapshot/snapshot.module";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...(!isChild ? shared.registerModules(options, true) : []),
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
  const modules = [(PlatBatchModule as unknown) as DynamicModule] as DynamicModule[];
  return modules;
};
