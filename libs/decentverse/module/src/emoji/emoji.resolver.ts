import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { EmojiService } from "./emoji.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";
@Resolver(() => gql.Emoji)
export class EmojiResolver extends BaseResolver(gql.Emoji, gql.EmojiInput, Allow.Every, Allow.Every, Allow.Admin) {
  constructor(
    private readonly emojiService: EmojiService,
    private readonly fileService: srv.shared.FileService,
    private readonly tokenService: srv.shared.TokenService
  ) {
    super(emojiService);
  }
  @Mutation(() => [gql.shared.File])
  @UseGuards(Allow.Admin)
  async addEmojiFiles(
    @Args({ name: "files", type: () => [gql.shared.FileUpload] }) files: gql.shared.FileUpload[],
    @Args({ name: "emojiId", type: () => String, nullable: true }) emojiId: string
  ) {
    return await this.fileService.addFiles(files, "emoji", emojiId);
  }
  @ResolveField(() => gql.shared.File)
  async file(@Parent() emoji: gql.Emoji) {
    return await this.fileService.load(emoji.file);
  }

  @ResolveField(() => gql.shared.File)
  async item(@Parent() emoji: gql.Emoji) {
    return await this.tokenService.load(emoji.token);
  }
}
