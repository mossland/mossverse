import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../gql";
import * as srv from "../srv";

@Resolver(() => gql.Exchange)
export class ExchangeResolver {
  constructor(
    private readonly tokenService: srv.shared.TokenService,
    private readonly thingService: srv.shared.ThingService,
    private readonly productService: srv.shared.ProductService,
    private readonly currencyService: srv.shared.CurrencyService
  ) {}

  @ResolveField(() => gql.shared.Token)
  async token(@Parent() exchange: gql.Exchange) {
    return await this.tokenService.load(exchange.token);
  }
  @ResolveField(() => gql.shared.Thing)
  async thing(@Parent() exchange: gql.Exchange) {
    return await this.thingService.load(exchange.thing);
  }
  @ResolveField(() => gql.shared.Product)
  async product(@Parent() exchange: gql.Exchange) {
    return await this.productService.load(exchange.product);
  }
  @ResolveField(() => gql.shared.Currency)
  async currency(@Parent() exchange: gql.Exchange) {
    return await this.currencyService.load(exchange.currency);
  }
}
