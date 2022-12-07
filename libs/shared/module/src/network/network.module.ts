import { DynamicModule, Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Network from "./network.model";
import { NetworkService } from "./network.service";
import { NetworkResolver } from "./network.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Network.name, useFactory: Network.middleware() }])],
  providers: [NetworkService, NetworkResolver],
  exports: [NetworkService],
})
export class NetworkModule {}
