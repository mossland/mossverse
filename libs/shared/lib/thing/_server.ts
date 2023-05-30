import * as Thing from "./thing.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ThingEmployee } from "./thing.employee";
import { ThingResolver } from "./thing.endpoint";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Thing.name, useFactory: Thing.middleware() }])],
  providers: [ThingEmployee, ThingResolver],
  exports: [ThingEmployee],
})
export class ThingModule {}
