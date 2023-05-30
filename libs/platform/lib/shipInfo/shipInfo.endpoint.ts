import * as cnst from "../cnst";
import * as emp from "../emp";
import { Allow, BaseResolver, Id } from "@util/server";
import { Args, ID, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ShipInfoEmployee } from "./shipInfo.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.ShipInfo)
export class ShipInfoResolver extends BaseResolver(
  cnst.ShipInfo,
  cnst.ShipInfoInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly shipInfoEmployee: ShipInfoEmployee,
    private readonly fileEmployee: emp.shared.FileEmployee,
    private readonly userEmployee: emp.shared.UserEmployee,
    private readonly productEmployee: emp.shared.ProductEmployee
  ) {
    super(shipInfoEmployee);
  }

  @Query(() => cnst.ShipInfo)
  @UseGuards(Allow.User)
  async getMyShipInfo(
    @Args({ name: "userId", type: () => ID }) userId: Id,
    @Args({ name: "productId", type: () => ID }) productId: Id
  ) {
    return await this.shipInfoEmployee.getShipInfo(new Id(userId), new Id(productId));
  }

  @ResolveField(() => [cnst.shared.User])
  async user(@Parent() shipInfo: cnst.ShipInfo) {
    if (!shipInfo.user) return null;
    return await this.userEmployee.load(shipInfo.user);
  }

  @ResolveField(() => [cnst.shared.Product])
  async product(@Parent() shipInfo: cnst.ShipInfo) {
    if (!shipInfo.product) return null;
    return await this.productEmployee.load(shipInfo.product);
  }
}
