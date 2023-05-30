import * as cnst from "../cnst";
import { Allow, BaseResolver } from "@util/server";
import { CharacterEmployee } from "../character/character.employee";
import { Dialog } from "./dialog.constant";
import { DialogEmployee } from "./dialog.employee";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

@Resolver(() => Dialog)
export class DialogResolver extends BaseResolver(
  cnst.Dialog,
  cnst.DialogInput,
  Allow.Public,
  Allow.Admin,
  Allow.Admin
) {
  constructor(private readonly dialogEmployee: DialogEmployee, private readonly characterEmployee: CharacterEmployee) {
    super(dialogEmployee);
  }
  @ResolveField(() => [cnst.Character])
  async characters(@Parent() dialog: cnst.Dialog) {
    return await this.characterEmployee.loadMany(dialog.characters);
  }
}
