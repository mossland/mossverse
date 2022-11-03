import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from "@nestjs/graphql";
import { MapService } from "./map.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Map)
export class MapResolver extends BaseResolver(gql.Map, gql.MapInput, Allow.Every, Allow.Every, Allow.Admin) {
  constructor(private readonly mapService: MapService, private readonly fileService: srv.shared.FileService) {
    super(mapService);
  }
  @Mutation(() => [gql.shared.File])
  @UseGuards(Allow.Admin)
  async addMapFiles(
    @Args({ name: "files", type: () => [gql.shared.FileUpload] }) files: gql.shared.FileUpload[],
    @Args({ name: "mapId", type: () => String, nullable: true }) mapId?: string
  ) {
    return await this.fileService.addFiles(files, "map", mapId);
  }
  @ResolveField(() => gql.shared.File)
  async top(@Parent() map: gql.Map) {
    return await this.fileService.load(map.top);
  }
  @ResolveField(() => gql.shared.File)
  async bottom(@Parent() map: gql.Map) {
    return await this.fileService.load(map.bottom);
  }
  @ResolveField(() => gql.shared.File)
  async lighting(@Parent() map: gql.Map) {
    return await this.fileService.load(map.lighting);
  }
}
