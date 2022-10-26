import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PlatBatchService } from "./platBatch.service";

@Global()
@Module({
  imports: [],
  providers: [PlatBatchService],
  exports: [PlatBatchService],
})
export class PlatBatchModule {}
