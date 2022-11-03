import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../gql";
import * as srv from "../srv";

@Resolver(() => gql.Tile)
export class TileResolver {
  constructor(private readonly fileService: srv.shared.FileService) {}
  @ResolveField(() => gql.shared.File)
  async top(@Parent() tile: gql.Tile) {
    return await this.fileService.load(tile.top);
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
