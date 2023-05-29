import * as cnst from "../cnst";
import * as emp from "../emp";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

@Resolver(() => cnst.PriceTag)
export class PriceTagResolver {
  constructor(
    private readonly tokenEmployee: emp.shared.TokenEmployee,
    private readonly thingEmployee: emp.shared.ThingEmployee
  ) {}

  @ResolveField(() => cnst.shared.Token)
  async token(@Parent() priceTag: cnst.PriceTag) {
    return await this.tokenEmployee.load(priceTag.token);
  }
  @ResolveField(() => cnst.shared.Thing)
  async thing(@Parent() priceTag: cnst.PriceTag) {
    return await this.thingEmployee.load(priceTag.thing);
  }
}
