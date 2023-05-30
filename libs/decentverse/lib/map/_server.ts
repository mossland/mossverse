import * as Map from "./map.document";
import { Global, Module } from "@nestjs/common";
import { MapResolver } from "./map.endpoint";
import { MapEmployee } from "./map.employee";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Map.name, useFactory: Map.middleware() }])],
  providers: [MapEmployee, MapResolver],
  exports: [MapEmployee],
})
export class MapModule {}
