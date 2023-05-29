import * as Dialog from "./dialog.document";
import { DialogResolver } from "./dialog.endpoint";
import { DialogEmployee } from "./dialog.employee";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Dialog.name, useFactory: Dialog.middleware() }])],
  providers: [DialogEmployee, DialogResolver],
  exports: [DialogEmployee],
})
export class DialogModule {}
