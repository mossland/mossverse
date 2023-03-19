import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as StakePool from "./stakePool.model";
import { StakePoolService } from "./stakePool.service";
import { StakePoolResolver } from "./stakePool.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: StakePool.name, useFactory: StakePool.middleware() }])],
  providers: [StakePoolService, StakePoolResolver],
  exports: [StakePoolService],
})
export class StakePoolModule {}
