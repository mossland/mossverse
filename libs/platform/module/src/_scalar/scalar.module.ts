import { Global, Module } from "@nestjs/common";
import { SurveyResponseResolver } from "./surveyResponse.resolver";
import { PriceTagResolver } from "./priceTag.resolver";
import { EntryResolver } from "./entry.resolver";
import { ExchangeResolver } from "./exchange.resolver";
import { UserSurveyResponseResolver } from "./userSurveyResponse.resolver";
import { MocOwnershipResolver } from "./mocOwnership.resolver";

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
