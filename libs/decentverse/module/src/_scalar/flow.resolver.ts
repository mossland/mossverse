import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { CharacterService } from "../character/character.service";

import * as gql from "../gql";
import * as srv from "../srv";

@Resolver(() => gql.Flow)
export class FlowResolver {
  constructor(
    // private readonly characterService: CharacterService,
    private readonly fileService: srv.shared.FileService
  ) {}

  @ResolveField(() => gql.shared.File)
  async image(@Parent() flow: gql.Flow) {
    return await this.fileService.load(flow.image);
  }

  @ResolveField(() => gql.shared.File)
  async background(@Parent() flow: gql.Flow) {
    return await this.fileService.load(flow.image);
  }
}
