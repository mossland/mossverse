import * as cnst from "../cnst";
import * as doc from "../doc";
import * as emp from "../emp";
import { Account, Allow, Auth, BaseResolver, Id } from "@util/server";
import { Args, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { CharacterEmployee } from "./character.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.Character)
export class CharacterResolver extends BaseResolver(
  cnst.Character,
  cnst.CharacterInput,
  Allow.Public,
  Allow.Public,
  Allow.Public
) {
  constructor(
    private readonly characterEmployee: CharacterEmployee,
    private readonly userEmployee: emp.shared.UserEmployee,
    private readonly fileEmployee: emp.shared.FileEmployee,
    private readonly thingEmployee: emp.shared.ThingEmployee
  ) {
    super(characterEmployee);
  }
  @Mutation(() => cnst.Character)
  @UseGuards(Allow.User)
  async reapplyCharacter(
    @Args({ name: "characterId", type: () => ID }) characterId: string,
    @Args({ name: "data", type: () => cnst.CharacterInput })
    data: cnst.CharacterInput,
    @Auth() account: Account
  ) {
    return await this.characterEmployee.reapplyCharacter(new Id(account.keyring), new Id(characterId), data);
  }

  @Mutation(() => cnst.Character)
  @UseGuards(Allow.Admin)
  async rejectCharacter(@Args({ name: "characterId", type: () => ID }) characterId: string) {
    return await this.characterEmployee.rejectCharacter(new Id(characterId));
  }

  @Mutation(() => cnst.Character)
  @UseGuards(Allow.Admin)
  async approveCharacter(@Args({ name: "characterId", type: () => ID }) characterId: string) {
    return await this.characterEmployee.approveCharacter(new Id(characterId));
  }

  @Mutation(() => [cnst.shared.File])
  @UseGuards(Allow.User)
  async addCharacterFiles(
    @Args({ name: "files", type: () => [cnst.shared.FileUpload] })
    files: cnst.shared.FileUpload[],
    @Args({ name: "metas", type: () => [cnst.shared.FileMeta] })
    metas: cnst.shared.FileMeta[],
    @Args({ name: "characterId", type: () => ID, nullable: true })
    characterId?: string
  ) {
    return await this.fileEmployee.addFiles(files, metas, "character", characterId);
  }
  @ResolveField(() => cnst.shared.User)
  async creator(@Parent() character: doc.Character.Doc) {
    return await this.userEmployee.load(character.creator);
  }
  @ResolveField(() => cnst.shared.File)
  async file(@Parent() character: doc.Character.Doc) {
    return await this.fileEmployee.load(character.file);
  }
  @ResolveField(() => cnst.shared.Thing, { nullable: true })
  async thing(@Parent() character: doc.Character.Doc) {
    return await this.thingEmployee.rootLoad(character._id);
  }
}
