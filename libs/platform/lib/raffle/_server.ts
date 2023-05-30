import * as Raffle from "./raffle.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RaffleEmployee } from "./raffle.employee";
import { RaffleResolver } from "./raffle.endpoint";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Raffle.name, useFactory: Raffle.middleware() }])],
  providers: [RaffleEmployee, RaffleResolver],
  exports: [RaffleEmployee],
})
export class RaffleModule {}
