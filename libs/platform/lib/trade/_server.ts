import * as Trade from "./trade.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TradeEmployee } from "./trade.employee";
import { TradeResolver } from "./trade.endpoint";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Trade.name, useFactory: Trade.middleware() }])],
  providers: [TradeEmployee, TradeResolver],
  exports: [TradeEmployee],
})
export class TradeModule {}
