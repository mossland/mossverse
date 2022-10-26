import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as db from "../db";
import * as gql from "../gql";
import { MapService } from "../map/map.service";
@Resolver(() => db.Area)
export class AreaResolver {
  constructor(private readonly mapService: MapService) {}

  @ResolveField(() => gql.Map)
  async map(@Parent() area: db.Area) {
    return await this.mapService.load(area.map);
  }
}
