import { Resolver } from "@nestjs/graphql";
import { UserEmployee } from "./user.employee";

import * as cnst from "../cnst";
import * as emp from "../emp";

@Resolver(() => cnst.shared.User)
export class UserResolver {
  constructor(
    private readonly userEmployee: UserEmployee,
    private readonly keyringEmployee: emp.shared.KeyringEmployee
  ) {}

  // @Mutation(() => [cnst.Inventory])
  // @UseGuards(Allow.Every)
  // async syncInventory(@Args({ name: "userId", type: () => ID }) userId: string) {
  //   // const inventory = await (await this.userEmployee.syncInventory(userId)).inventory;
  //   const inventoryIds = inventory.map((item) => item.item);
  //   const items = await this.tokenEmployee.loadMany(inventoryIds);
  //   const inventoryFields = inventory.map((item, idx) => {
  //     return {
  //       item: items[idx],
  //       num: item.num,
  //     };
  //   });

  //   return inventoryFields;
  // }
}
