import * as Live from "./live.document";
import { Global, Module } from "@nestjs/common";
import { LiveResolver } from "./live.endpoint";
import { LiveEmployee } from "./live.employee";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Live.name, useFactory: Live.middleware() }])],
  providers: [LiveEmployee, LiveResolver],
  exports: [LiveEmployee],
})
export class LiveModule {}
