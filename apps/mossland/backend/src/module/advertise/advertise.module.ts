import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Advertise from "./advertise.model";
import { AdvertiseService } from "./advertise.service";
import { AdvertiseResolver } from "./advertise.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Advertise.name, useFactory: Advertise.middleware() }])],
  providers: [AdvertiseService, AdvertiseResolver],
  exports: [AdvertiseService],
})
export class AdvertiseModule {}
