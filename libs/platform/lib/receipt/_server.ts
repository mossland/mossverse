import * as Receipt from "./receipt.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReceiptEmployee } from "./receipt.employee";
import { ReceiptResolver } from "./receipt.endpoint";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Receipt.name, useFactory: Receipt.middleware() }])],
  providers: [ReceiptEmployee, ReceiptResolver],
  exports: [ReceiptEmployee],
})
export class ReceiptModule {}
