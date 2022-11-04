import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { DialogService } from "../dialog/dialog.service";
import * as gql from "../gql";
@Resolver(() => gql.Dialogue)
export class DialogueResolver {
  constructor(private readonly dialogService: DialogService) {}

  @ResolveField(() => gql.Dialog)
  async dialog(@Parent() dialogue: gql.Dialogue) {
    return await this.dialogService.load(dialogue.dialog);
  }
}
