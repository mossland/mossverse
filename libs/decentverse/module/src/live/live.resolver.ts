import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { LiveService } from "./live.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Live)
export class LiveResolver extends BaseResolver(gql.Live, gql.LiveInput, Allow.Every, Allow.Every, Allow.Every) {
  constructor(
    private readonly liveService: LiveService,
    private readonly fileService: srv.shared.FileService,
    private readonly mapService: srv.MapService
  ) {
    super(liveService);
  }
  @ResolveField(() => gql.Map)
  async map(@Parent() live: gql.Live) {
    return await this.mapService.load(live.map);
  }
}
