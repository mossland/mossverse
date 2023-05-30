import * as Placement from "./placement.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PlacementResolver } from "./placement.endpoint";
import { PlacementEmployee } from "./placement.employee";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Placement.name, useFactory: Placement.middleware() }])],
  providers: [PlacementEmployee, PlacementResolver],
  exports: [PlacementEmployee],
})
export class PlacementModule {}
