import * as cnst from "../cnst";
import * as emp from "../emp";
import { Allow, BaseResolver } from "@util/server";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { PlacementEmployee } from "./placement.employee";

@Resolver(() => cnst.Placement)
export class PlacementResolver extends BaseResolver(
  cnst.Placement,
  cnst.PlacementInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly placementEmployee: PlacementEmployee,
    private readonly fileEmployee: emp.shared.FileEmployee,
    private readonly assetEmployee: emp.AssetEmployee,
    private readonly mapEmployee: emp.MapEmployee
  ) {
    super(placementEmployee);
  }
  @ResolveField(() => cnst.Asset)
  async asset(@Parent() placement: cnst.Placement) {
    return await this.assetEmployee.load(placement.asset);
  }
  @ResolveField(() => cnst.Map)
  async map(@Parent() placement: cnst.Placement) {
    return await this.mapEmployee.load(placement.map);
  }
}