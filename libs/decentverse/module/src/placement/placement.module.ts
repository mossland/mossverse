import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Placement from "./placement.model";
import { PlacementService } from "./placement.service";
import { PlacementResolver } from "./placement.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Placement.name, useFactory: Placement.middleware() }])],
  providers: [PlacementService, PlacementResolver],
  exports: [PlacementService],
})
export class PlacementModule {}
