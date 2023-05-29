import * as ShipInfo from "./shipInfo.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ShipInfoEmployee } from "./shipInfo.employee";
import { ShipInfoResolver } from "./shipInfo.endpoint";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: ShipInfo.name, useFactory: ShipInfo.middleware() }])],
  providers: [ShipInfoEmployee, ShipInfoResolver],
  exports: [ShipInfoEmployee],
})
export class ShipInfoModule {}
