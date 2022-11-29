import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Currency from "./currency.model";
import { CurrencyService } from "./currency.service";
import { CurrencyResolver } from "./currency.resolver";
import * as option from "../option";
import { UsdModule } from "./usd/usd.module";
import { EthModule } from "./eth/eth.module";

@Global()
@Module({})
export class CurrencyModule {
  static register(options: option.EtherOptions): DynamicModule {
    return {
      module: CurrencyModule,
      imports: [
        MongooseModule.forFeatureAsync([{ name: Currency.name, useFactory: Currency.middleware() }]),
        UsdModule.register(options),
        EthModule.register(options),
      ],
      providers: [CurrencyService, CurrencyResolver],
      exports: [CurrencyService],
    };
  }
}
