import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { TileService } from "./tile.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Tile)
export class TileResolver extends BaseResolver(gql.Tile, gql.TileInput, Allow.Every, Allow.Every, Allow.Every) {
  constructor(
    private readonly tileService: TileService,
    private readonly fileService: srv.shared.FileService,
    private readonly mapService: srv.MapService
  ) {
    super(tileService);
  }
  @Mutation(() => [gql.shared.File])
  @UseGuards(Allow.Admin)
  async addTileFiles(
    @Args({ name: "files", type: () => [gql.shared.FileUpload] }) files: gql.shared.FileUpload[],
    @Args({ name: "tileId", type: () => ID, nullable: true }) tileId?: string
  ) {
    return await this.fileService.addFiles(files, "tile", tileId);
  }
  @ResolveField(() => gql.Map)
  async map(@Parent() tile: gql.Tile) {
    return await this.mapService.load(tile.map);
  }
  @ResolveField(() => gql.shared.File)
  async top(@Parent() tile: gql.Tile) {
    return await this.fileService.load(tile.top);
  }
  @ResolveField(() => gql.shared.File)
  async wall(@Parent() tile: gql.Tile) {
    return await this.fileService.load(tile.wall);
  }
  @ResolveField(() => gql.shared.File)
  async bottom(@Parent() tile: gql.Tile) {
    return await this.fileService.load(tile.bottom);
  }
  @ResolveField(() => gql.shared.File)
  async lighting(@Parent() tile: gql.Tile) {
    return await this.fileService.load(tile.lighting);
  }
}
