import * as cnst from "../cnst";
import { MapEmployee } from "../map/map.employee";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
@Resolver(() => cnst.Area)
export class AreaResolver {
  constructor(private readonly mapEmployee: MapEmployee) {}

  @ResolveField(() => cnst.Map)
  async map(@Parent() area: cnst.Area) {
    return await this.mapEmployee.load(area.map);
  }
}
