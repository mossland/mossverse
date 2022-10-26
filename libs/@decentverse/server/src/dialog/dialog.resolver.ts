import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from "@nestjs/graphql";
import { DialogService } from "./dialog.service";
import { Dialog } from "./dialog.gql";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import { CharacterService } from "../character/character.service";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";

@Resolver(() => Dialog)
export class DialogResolver extends BaseResolver(gql.Dialog, gql.DialogInput, Allow.Public, Allow.Admin, Allow.Admin) {
  constructor(private readonly dialogService: DialogService, private readonly characterService: CharacterService) {
    super(dialogService);
  }
  @ResolveField(() => [gql.Character])
  async characters(@Parent() dialog: gql.Dialog) {
    return await this.characterService.loadMany(dialog.characters);
  }
}
