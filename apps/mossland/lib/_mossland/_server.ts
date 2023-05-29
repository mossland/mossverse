import { BatchEmployee } from "./mossland.employee";
import { Global, Module } from "@nestjs/common";
import { StakingResolver } from "./staking.endpoint";

@Global()
@Module({
  imports: [],
  providers: [BatchEmployee],
  exports: [BatchEmployee],
})
export class BatchModule {}

@Global()
@Module({
  providers: [StakingResolver],
})
export class ScalarModule {}
