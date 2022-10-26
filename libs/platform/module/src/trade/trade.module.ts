import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Trade from "./trade.model";
import { TradeService } from "./trade.service";
import { TradeResolver } from "./trade.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Trade.name, useFactory: Trade.middleware() }])],
  providers: [TradeService, TradeResolver],
  exports: [TradeService],
})
export class TradeModule {}
