import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { SkinManagerService } from "./skinManager.service";
import { Allow, Account, BaseResolver, Auth, Signature, Id } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver()
export class SkinManagerResolver {
  constructor(private readonly skinManagerService: SkinManagerService) {}

  @Mutation(() => gql.platform.Trade)
  @UseGuards(Allow.User)
  async tradeSkin(
    @Args({ name: "characterId", type: () => ID }) characterId: string,
    @Args({ name: "data", type: () => gql.platform.TradeInput }) data: gql.platform.TradeInput,
    @Auth() account: Account,
    @Signature() address: string
  ) {
    return await this.skinManagerService.tradeSkin(new Id(characterId), data, new Id(account.keyring), address);
  }
}
