import * as Advertise from "./advertise.document";
import { AdvertiseResolver } from "./advertise.endpoint";
import { AdvertiseEmployee } from "./advertise.employee";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Advertise.name, useFactory: Advertise.middleware() }])],
  providers: [AdvertiseEmployee, AdvertiseResolver],
  exports: [AdvertiseEmployee],
})
export class AdvertiseModule {}
