import { Global, Module, DynamicModule } from "@nestjs/common";
import { EtherResolver } from "./ether.resolver";
import { BullModule } from "@nestjs/bull";
import { EtherService } from "./ether.service";
import { EtherOptions } from "../../options";
import { RedisOptions } from "@shared/util-server";

@Module({})
export class EtherModule {
  static register(options?: EtherOptions, redisOptions?: RedisOptions): DynamicModule {
    return {
      module: EtherModule,
      imports: [
        // BullModule.registerQueue({
        //   name: "ether",
        //   // redis: {
        //   //   host: redisOptions.url?.split(":")[0].replace("redis://", "") ?? "localhost",
        //   //   port: parseInt(redisOptions.url?.split(":")[1] ?? "6379"),
        //   // },
        // }),
      ],
      providers: [
        {
          provide: "ETHER_OPTIONS",
          useValue: options,
        },
        EtherService,
        EtherResolver,
      ],
      exports: [EtherService],
    };
  }
}
