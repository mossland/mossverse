import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BatchService } from "./batch.service";

@Global()
@Module({
  imports: [],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
