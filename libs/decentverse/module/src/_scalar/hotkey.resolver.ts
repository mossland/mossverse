import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../gql";
import { EmojiService } from "../emoji/emoji.service";
@Resolver(() => gql.Hotkey)
export class HotkeyResolver {
  constructor(private readonly emojiService: EmojiService) {}

  @ResolveField(() => gql.Emoji)
  async emoji(@Parent() hotkey: gql.Hotkey) {
    return await this.emojiService.load(hotkey.emoji);
  }
}
