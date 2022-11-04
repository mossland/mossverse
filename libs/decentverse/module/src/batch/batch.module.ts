import { Global, Module } from "@nestjs/common";
import { BatchService } from "./batch.service";

@Global()
@Module({
  providers: [BatchService],
})
export class BatchModule {}
