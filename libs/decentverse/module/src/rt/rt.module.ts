import { Global, Module, DynamicModule } from "@nestjs/common";
import { RedisOptions } from "@shared/util-server";
import { RtService } from "./rt.service";
import { createClient } from "redis";

@Global()
@Module({})
export class RtModule {
  static register(options: RedisOptions): DynamicModule {
    return {
      module: RtModule,
      providers: [
        {
          provide: "REDIS_CLIENT",
          useFactory: async () => {
            const client = createClient(options);
            await client.connect();
            return client;
          },
        },
        RtService,
      ],
      exports: [RtService],
    };
  }
}
