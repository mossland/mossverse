import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int } from "@nestjs/graphql";
import { CharacterService } from "./character.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Character)
export class CharacterResolver extends BaseResolver(
  gql.Character,
  gql.CharacterInput,
  Allow.Public,
  Allow.Public,
  Allow.Admin
) {
  constructor(
    private readonly characterService: CharacterService,
    private readonly fileService: srv.shared.FileService
  ) {
    super(characterService);
  }
  @Mutation(() => [gql.shared.File])
  @UseGuards(Allow.Admin)
  async addCharacterFiles(
    @Args({ name: "files", type: () => [gql.shared.FileUpload] }) files: gql.shared.FileUpload[],
    @Args({ name: "characterId", type: () => String, nullable: true }) characterId?: string
  ) {
    return await this.fileService.addFiles(files, "character", characterId);
  }
  @ResolveField(() => gql.shared.File)
  async file(@Parent() character: gql.Character) {
    return await this.fileService.load(character.file);
  }
}
