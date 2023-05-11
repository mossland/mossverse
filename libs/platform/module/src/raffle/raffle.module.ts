import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Raffle from "./raffle.model";
import { RaffleService } from "./raffle.service";
import { RaffleResolver } from "./raffle.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Raffle.name, useFactory: Raffle.middleware() }])],
  providers: [RaffleService, RaffleResolver],
  exports: [RaffleService],
})
export class RaffleModule {}
