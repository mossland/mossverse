import * as StakePool from "./stakePool.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StakePoolResolver } from "./stakePool.endpoint";
import { StakePoolEmployee } from "./stakePool.employee";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: StakePool.name, useFactory: StakePool.middleware() }])],
  providers: [StakePoolEmployee, StakePoolResolver],
  exports: [StakePoolEmployee],
})
export class StakePoolModule {}
