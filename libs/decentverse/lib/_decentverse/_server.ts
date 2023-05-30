import { AreaResolver } from "./area.endpoint";
import { BatchEmployee } from "./decentverse.employee";
import { FlowResolver } from "./flow.endpoint";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  providers: [
    AreaResolver,
    FlowResolver,
    //  DialogueResolver
  ],
})
export class ScalarModule {}

@Global()
@Module({
  providers: [BatchEmployee],
})
export class BatchModule {}
