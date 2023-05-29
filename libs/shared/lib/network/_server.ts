import * as Network from "./network.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NetworkEmployee } from "./network.employee";
import { NetworkResolver } from "./network.endpoint";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Network.name, useFactory: Network.middleware() }])],
  providers: [NetworkEmployee, NetworkResolver],
  exports: [NetworkEmployee],
})
export class NetworkModule {}
