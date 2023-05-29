import * as Currency from "./currency.document";
import { CurrencyEmployee } from "./currency.employee";
import { CurrencyResolver } from "./currency.endpoint";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Currency.name, useFactory: Currency.middleware() }])],
  providers: [CurrencyEmployee, CurrencyResolver],
  exports: [CurrencyEmployee],
})
export class CurrencyModule {}
