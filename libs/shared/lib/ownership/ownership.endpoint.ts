import * as cnst from "../cnst";
import { Allow, BaseResolver } from "@util/server";
import { Args, ID, Parent, ResolveField, Resolver, Subscription } from "@nestjs/graphql";
import { OwnershipEmployee } from "./ownership.employee";
import { ThingEmployee } from "../thing/thing.employee";
import { TokenEmployee } from "../token/token.employee";
import { emp as external } from "@external/server";

@Resolver(() => cnst.Ownership)
export class OwnershipResolver extends BaseResolver(
  cnst.Ownership,
  cnst.OwnershipInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly ownershipEmployee: OwnershipEmployee,
    private readonly pubsubEmployee: external.PubsubEmployee,
    private readonly tokenEmployee: TokenEmployee,
    private readonly thingEmployee: ThingEmployee
  ) {
    super(ownershipEmployee);
  }

  @Subscription(() => cnst.OwnershipUpdate, {
    name: "ownershipUpdated",
    filter: (payload: { ownershipUpdated: cnst.OwnershipUpdate }, variables: { user: string }) =>
      payload.ownershipUpdated.user?.toString() === variables.user,
  })
  ownershipUpdated(@Args({ name: "user", type: () => ID }) user: string) {
    return this.pubsubEmployee.pubsub.asyncIterator("ownershipUpdated");
  }

  @ResolveField(() => cnst.Thing)
  async thing(@Parent() ownership: cnst.Ownership) {
    return await this.thingEmployee.load(ownership.thing);
  }
  @ResolveField(() => cnst.Token)
  async token(@Parent() ownership: cnst.Ownership) {
    return await this.tokenEmployee.load(ownership.token);
  }
}
