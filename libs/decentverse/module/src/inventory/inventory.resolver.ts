import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver()
export class InventoryResolver {
  constructor(private readonly inventoryService: srv.InventoryService) {}
  // @Mutation(() => Boolean)
  // @UseGuards(Allow.Every)
  // async useItem(
  //   @Args({ name: "userId", type: () => ID }) userId: string,
  //   @Args({ name: "itemId", type: () => ID }) itemId: string
  // ) {
  //   return await this.inventoryService.useItem(userId, itemId);
  // }
}
