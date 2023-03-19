import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID, Subscription } from "@nestjs/graphql";
import { OwnershipService } from "./ownership.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import { UseGuards } from "@nestjs/common";
import { srv as external } from "@external/module";
import { TokenService } from "../token/token.service";
import { ThingService } from "../thing/thing.service";

@Resolver(() => gql.Ownership)
export class OwnershipResolver extends BaseResolver(
  gql.Ownership,
  gql.OwnershipInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly ownershipService: OwnershipService,
    private readonly pubsubService: external.PubsubService,
    private readonly tokenService: TokenService,
    private readonly thingService: ThingService
  ) {
    super(ownershipService);
  }

  @Subscription(() => gql.OwnershipUpdate, {
    name: "ownershipUpdated",
    filter: (payload: { ownershipUpdated: gql.OwnershipUpdate }, variables: { user: string }) =>
      payload.ownershipUpdated.user?.toString() === variables.user,
  })
  ownershipUpdated(@Args({ name: "user", type: () => ID }) user: string) {
    return this.pubsubService.pubsub.asyncIterator("ownershipUpdated");
  }

  @ResolveField(() => gql.Thing)
  async thing(@Parent() ownership: gql.Ownership) {
    return await this.thingService.load(ownership.thing);
  }
  @ResolveField(() => gql.Token)
  async token(@Parent() ownership: gql.Ownership) {
    return await this.tokenService.load(ownership.token);
  }
}
