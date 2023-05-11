import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { TeleportService } from "./teleport.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";
import { MapService } from "../map/map.service";
@Resolver(() => gql.Teleport)
export class TeleportResolver extends BaseResolver(
  gql.Teleport,
  gql.TeleportInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(private readonly teleportService: TeleportService, private readonly mapService: MapService) {
    super(teleportService);
  }
  @ResolveField(() => gql.Map)
  async map(@Parent() teleport: gql.Teleport) {
    return await this.mapService.load(teleport.map);
  }
}
