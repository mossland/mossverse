import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { CharacterService } from "./character.service";
import { Allow, Account, BaseResolver, Id, Auth, RequiredAuth } from "@shared/util-server";
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
  Allow.Public
) {
  constructor(
    private readonly characterService: CharacterService,
    private readonly userService: srv.shared.UserService,
    private readonly fileService: srv.shared.FileService,
    private readonly thingService: srv.shared.ThingService
  ) {
    super(characterService);
  }
  @Mutation(() => gql.Character)
  @UseGuards(Allow.User)
  async reapplyCharacter(
    @Args({ name: "characterId", type: () => ID }) characterId: string,
    @Args({ name: "data", type: () => gql.CharacterInput }) data: gql.CharacterInput,
    @Auth() account: Account
  ) {
    return await this.characterService.reapplyCharacter(new Id(account.keyring), new Id(characterId), data);
  }

  @Mutation(() => gql.Character)
  @UseGuards(Allow.Admin)
  async rejectCharacter(@Args({ name: "characterId", type: () => ID }) characterId: string) {
    return await this.characterService.rejectCharacter(new Id(characterId));
  }

  @Mutation(() => gql.Character)
  @UseGuards(Allow.Admin)
  async approveCharacter(@Args({ name: "characterId", type: () => ID }) characterId: string) {
    return await this.characterService.approveCharacter(new Id(characterId));
  }

  @Mutation(() => [gql.shared.File])
  @UseGuards(Allow.User)
  async addCharacterFiles(
    @Args({ name: "files", type: () => [gql.shared.FileUpload] }) files: gql.shared.FileUpload[],
    @Args({ name: "characterId", type: () => ID, nullable: true }) characterId?: string
  ) {
    return await this.fileService.addFiles(files, "character", characterId);
  }
  @ResolveField(() => gql.shared.User)
  async creator(@Parent() character: db.Character.Doc) {
    return await this.userService.load(character.creator);
  }
  @ResolveField(() => gql.shared.File)
  async file(@Parent() character: db.Character.Doc) {
    return await this.fileService.load(character.file);
  }
  @ResolveField(() => gql.shared.Thing, { nullable: true })
  async thing(@Parent() character: db.Character.Doc) {
    return await this.thingService.rootLoad(character._id);
  }
}
