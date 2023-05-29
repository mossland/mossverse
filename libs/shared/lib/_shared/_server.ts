import { Global, Module } from "@nestjs/common";
import { SharedBatchService } from "./shared.employee";

@Global()
@Module({
  providers: [],
})
export class ScalarModule {}

@Global()
@Module({
  imports: [],
  providers: [SharedBatchService],
  exports: [SharedBatchService],
})
export class SharedBatchModule {}
