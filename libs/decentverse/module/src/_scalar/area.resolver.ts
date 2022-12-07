import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../gql";
import { MapService } from "../map/map.service";
@Resolver(() => gql.Area)
export class AreaResolver {
  constructor(private readonly mapService: MapService) {}

  @ResolveField(() => gql.Map)
  async map(@Parent() area: gql.Area) {
    return await this.mapService.load(area.map);
  }
}
