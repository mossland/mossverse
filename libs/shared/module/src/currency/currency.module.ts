import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Currency from "./currency.model";
import { CurrencyService } from "./currency.service";
import { CurrencyResolver } from "./currency.resolver";
import * as option from "../option";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Currency.name, useFactory: Currency.middleware() }])],
  providers: [CurrencyService, CurrencyResolver],
  exports: [CurrencyService],
})
export class CurrencyModule {}
