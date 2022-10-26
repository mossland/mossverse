import { Resolver, Query, Mutation, Args, Parent, ResolveField, ID } from "@nestjs/graphql";
// import { UserService } from "./user.service";
import { Allow, Account, BaseResolver, Auth } from "@shared/util-server";
import { modules } from "@shared/module";
import { UserService } from "./user.service";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.shared.User)
export class UserResolver {
  constructor(private readonly userService: UserService) {
    // super(userService, keyringService);
  }

  // @Mutation(() => [gql.Inventory])
  // @UseGuards(Allow.Every)
  // async syncInventory(@Args({ name: "userId", type: () => ID }) userId: string) {
  //   // const inventory = await (await this.userService.syncInventory(userId)).inventory;
  //   const inventoryIds = inventory.map((item) => item.item);
  //   const items = await this.tokenService.loadMany(inventoryIds);
  //   const inventoryFields = inventory.map((item, idx) => {
  //     return {
  //       item: items[idx],
  //       num: item.num,
  //     };
  //   });

  //   return inventoryFields;
  // }
}
