import * as cnst from "../cnst";
import { Allow, BaseResolver } from "@util/server";
import { MapEmployee } from "../map/map.employee";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { TeleportEmployee } from "./teleport.employee";
@Resolver(() => cnst.Teleport)
export class TeleportResolver extends BaseResolver(
  cnst.Teleport,
  cnst.TeleportInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(private readonly teleportEmployee: TeleportEmployee, private readonly mapEmployee: MapEmployee) {
    super(teleportEmployee);
  }
  @ResolveField(() => cnst.Map)
  async map(@Parent() teleport: cnst.Teleport) {
    return await this.mapEmployee.load(teleport.map);
  }
}
