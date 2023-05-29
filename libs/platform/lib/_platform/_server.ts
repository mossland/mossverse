import { EntryResolver } from "./entry.endpoint";
import { ExchangeResolver } from "./exchange.endpoint";
import { Global, Module } from "@nestjs/common";
import { MocOwnershipResolver } from "./mocOwnership.endpoint";
import { PlatformEmployee } from "./platform.employee";
import { PriceTagResolver } from "./priceTag.endpoint";
import { SurveyResponseResolver } from "./surveyResponse.endpoint";
import { UserSurveyResponseResolver } from "./userSurveyResponse.endpoint";

@Global()
@Module({
  imports: [],
  providers: [PlatformEmployee],
  exports: [PlatformEmployee],
})
export class PlatBatchModule {}
@Global()
@Module({
  providers: [
    SurveyResponseResolver,
    UserSurveyResponseResolver,
    MocOwnershipResolver,
    EntryResolver,
    PriceTagResolver,
    ExchangeResolver,
  ],
})
export class ScalarModule {}
