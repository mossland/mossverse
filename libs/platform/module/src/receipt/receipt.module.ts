import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Receipt from "./receipt.model";
import { ReceiptService } from "./receipt.service";
import { ReceiptResolver } from "./receipt.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Receipt.name, useFactory: Receipt.middleware() }])],
  providers: [ReceiptService, ReceiptResolver],
  exports: [ReceiptService],
})
export class ReceiptModule {}
