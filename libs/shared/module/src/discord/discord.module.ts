import { DynamicModule, Global, Module } from "@nestjs/common";
import { DiscordService } from "./discord.service";
import { DiscordOptions } from "../option";
import { makeDiscordBots } from "@shared/util-server";
@Global()
@Module({
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {
  static register(options: DiscordOptions): DynamicModule {
    return {
      module: DiscordModule,
      providers: [
        {
          provide: "DISCORD_OPTIONS",
          useFactory: async () => {
            const bots = await makeDiscordBots(options.tokens);
            return bots;
          },
        },
        DiscordService,
      ],
      exports: [DiscordService],
    };
  }
}
