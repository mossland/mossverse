import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedBatchService } from "./sharedBatch.service";

@Global()
@Module({
  imports: [],
  providers: [SharedBatchService],
  exports: [SharedBatchService],
})
export class SharedBatchModule {}
