import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as ShipInfo from "./shipInfo.model";
import { ShipInfoService } from "./shipInfo.service";
import { ShipInfoResolver } from "./shipInfo.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: ShipInfo.name, useFactory: ShipInfo.middleware() }])],
  providers: [ShipInfoService, ShipInfoResolver],
  exports: [ShipInfoService],
})
export class ShipInfoModule {}
