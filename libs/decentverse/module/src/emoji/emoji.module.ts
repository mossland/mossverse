import { Global, Module, DynamicModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Emoji from "./emoji.model";
import { EmojiService } from "./emoji.service";
import { EmojiResolver } from "./emoji.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Emoji.name, useFactory: Emoji.middleware() }])],
  providers: [EmojiService, EmojiResolver],
  exports: [EmojiService],
})
export class EmojiModule {}
