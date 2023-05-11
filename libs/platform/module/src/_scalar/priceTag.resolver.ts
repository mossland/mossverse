import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../gql";
import * as srv from "../srv";

@Resolver(() => gql.PriceTag)
export class PriceTagResolver {
  constructor(
    private readonly tokenService: srv.shared.TokenService,
    private readonly thingService: srv.shared.ThingService
  ) {}

  @ResolveField(() => gql.shared.Token)
  async token(@Parent() priceTag: gql.PriceTag) {
    return await this.tokenService.load(priceTag.token);
  }
  @ResolveField(() => gql.shared.Thing)
  async thing(@Parent() priceTag: gql.PriceTag) {
    return await this.thingService.load(priceTag.thing);
  }
}
