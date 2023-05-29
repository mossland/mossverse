import * as Teleport from "./teleport.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TeleportResolver } from "./teleport.endpoint";
import { TeleportEmployee } from "./teleport.employee";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Teleport.name, useFactory: Teleport.middleware() }])],
  providers: [TeleportEmployee, TeleportResolver],
  exports: [TeleportEmployee],
})
export class TeleportModule {}
