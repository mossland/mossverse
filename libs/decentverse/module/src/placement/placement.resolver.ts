import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { PlacementService } from "./placement.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Placement)
export class PlacementResolver extends BaseResolver(
  gql.Placement,
  gql.PlacementInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly placementService: PlacementService,
    private readonly fileService: srv.shared.FileService,
    private readonly assetService: srv.AssetService,
    private readonly mapService: srv.MapService
  ) {
    super(placementService);
  }
  @ResolveField(() => gql.Asset)
  async asset(@Parent() placement: gql.Placement) {
    return await this.assetService.load(placement.asset);
  }
  @ResolveField(() => gql.Map)
  async map(@Parent() placement: gql.Placement) {
    return await this.mapService.load(placement.map);
  }
}
