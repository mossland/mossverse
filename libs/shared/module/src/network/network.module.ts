import { DynamicModule, Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Network from "./network.model";
import { NetworkService } from "./network.service";
import { NetworkResolver } from "./network.resolver";
import { NetworkOptions } from "../options";
import { RedisOptions } from "@shared/util-server";
import { EtherModule } from "./ether/ether.module";
import { CaverModule } from "./caver/caver.module";

@Global()
@Module({})
export class NetworkModule {
  static register(options: NetworkOptions, redisOptions: RedisOptions): DynamicModule {
    return {
      module: NetworkModule,
      imports: [
        MongooseModule.forFeatureAsync([{ name: Network.name, useFactory: Network.middleware() }]),
        options.klaytn && redisOptions && CaverModule.register(options.klaytn, redisOptions),
        options.ethereum && redisOptions && EtherModule.register(options.ethereum, redisOptions),
      ].filter((module) => !!module) as DynamicModule[],
      providers: [
        {
          provide: "NETWORK_OPTIONS",
          useValue: options,
        },
        NetworkService,
        NetworkResolver,
      ],
      exports: [NetworkService],
    };
  }
}
