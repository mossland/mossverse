import * as cnst from "../cnst";
import * as emp from "../emp";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

@Resolver(() => cnst.Exchange)
export class ExchangeResolver {
  constructor(
    private readonly tokenEmployee: emp.shared.TokenEmployee,
    private readonly thingEmployee: emp.shared.ThingEmployee,
    private readonly productEmployee: emp.shared.ProductEmployee,
    private readonly currencyEmployee: emp.shared.CurrencyEmployee
  ) {}

  @ResolveField(() => cnst.shared.Token)
  async token(@Parent() exchange: cnst.Exchange) {
    return await this.tokenEmployee.load(exchange.token);
  }
  @ResolveField(() => cnst.shared.Thing)
  async thing(@Parent() exchange: cnst.Exchange) {
    return await this.thingEmployee.load(exchange.thing);
  }
  @ResolveField(() => cnst.shared.Product)
  async product(@Parent() exchange: cnst.Exchange) {
    return await this.productEmployee.load(exchange.product);
  }
  @ResolveField(() => cnst.shared.Currency)
  async currency(@Parent() exchange: cnst.Exchange) {
    return await this.currencyEmployee.load(exchange.currency);
  }
}
