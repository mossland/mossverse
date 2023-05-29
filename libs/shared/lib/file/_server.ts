import * as File from "./file.document";
import { FileEmployee } from "./file.employee";
import { FileResolver } from "./file.endpoint";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: File.name, useFactory: File.middleware() }])],
  providers: [FileEmployee, FileResolver],
  exports: [FileEmployee],
})
export class FileModule {}
