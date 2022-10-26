import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../gql";
import * as srv from "../srv";

@Resolver(() => gql.Exchange)
export class ExchangeResolver {
  constructor(
    private readonly tokenService: srv.shared.TokenService,
    private readonly thingService: srv.shared.ThingService
  ) {}

  @ResolveField(() => gql.shared.Token)
  async token(@Parent() exchange: gql.Exchange) {
    return await this.tokenService.load(exchange.token);
  }
  @ResolveField(() => gql.shared.Thing)
  async thing(@Parent() exchange: gql.Exchange) {
    return await this.thingService.load(exchange.thing);
  }
  @ResolveField(() => gql.shared.Thing)
  async product(@Parent() exchange: gql.Exchange) {
    return await this.thingService.load(exchange.product);
  }
}
