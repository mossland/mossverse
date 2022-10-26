import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../gql";
import * as srv from "../srv";

@Resolver(() => gql.ThingItem)
export class ThingItemResolver {
  constructor(private readonly thingService: srv.ThingService) {}

  @ResolveField(() => gql.Thing)
  async thing(@Parent() item: gql.ThingItem) {
    return await this.thingService.load(item.thing);
  }
}
