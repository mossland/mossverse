import * as cnst from "../cnst";
import { DialogEmployee } from "../dialog/dialog.employee";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
@Resolver(() => cnst.Dialogue)
export class DialogueResolver {
  constructor(private readonly dialogEmployee: DialogEmployee) {}

  @ResolveField(() => cnst.Dialog)
  async dialog(@Parent() dialogue: cnst.Dialogue) {
    return await this.dialogEmployee.load(dialogue.dialog);
  }
}
