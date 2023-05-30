import * as cnst from "../cnst";
import * as emp from "../emp";
import { Allow, BaseResolver } from "@util/server";
import { Args, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { TileEmployee } from "./tile.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.Tile)
export class TileResolver extends BaseResolver(cnst.Tile, cnst.TileInput, Allow.Every, Allow.Every, Allow.Every) {
  constructor(
    private readonly tileEmployee: TileEmployee,
    private readonly fileEmployee: emp.shared.FileEmployee,
    private readonly mapEmployee: emp.MapEmployee
  ) {
    super(tileEmployee);
  }
  @Mutation(() => [cnst.shared.File])
  @UseGuards(Allow.Admin)
  async addTileFiles(
    @Args({ name: "files", type: () => [cnst.shared.FileUpload] })
    files: cnst.shared.FileUpload[],
    @Args({ name: "metas", type: () => [cnst.shared.FileMeta] })
    metas: cnst.shared.FileMeta[],
    @Args({ name: "tileId", type: () => ID, nullable: true }) tileId?: string
  ) {
    return await this.fileEmployee.addFiles(files, metas, "tile", tileId);
  }
  @ResolveField(() => cnst.Map)
  async map(@Parent() tile: cnst.Tile) {
    return await this.mapEmployee.load(tile.map);
  }
  @ResolveField(() => cnst.shared.File)
  async top(@Parent() tile: cnst.Tile) {
    return await this.fileEmployee.load(tile.top);
  }
  @ResolveField(() => cnst.shared.File)
  async wall(@Parent() tile: cnst.Tile) {
    return await this.fileEmployee.load(tile.wall);
  }
  @ResolveField(() => cnst.shared.File)
  async bottom(@Parent() tile: cnst.Tile) {
    return await this.fileEmployee.load(tile.bottom);
  }
  @ResolveField(() => cnst.shared.File)
  async lighting(@Parent() tile: cnst.Tile) {
    return await this.fileEmployee.load(tile.lighting);
  }
}
