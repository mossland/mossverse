import { DynamicModule, Global, Module } from "@nestjs/common";
import { RedisOptions } from "@util/server";
import { RtEmployee } from "./rt.employee";
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
            const client = createClient({
              url: `redis://${options.host}:${options.port}`,
            });
            await client.connect();
            return client;
          },
        },
        RtEmployee,
      ],
      exports: [RtEmployee],
    };
  }
}
