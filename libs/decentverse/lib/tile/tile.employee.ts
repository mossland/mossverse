import * as Tile from "./tile.document";
import * as cnst from "../cnst";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";

@Injectable()
export class TileEmployee extends LoadService<Tile.Mdl, Tile.Doc, Tile.Input> {
  constructor(
    @InjectModel(Tile.name)
    private readonly Tile: Tile.Mdl
  ) {
    super(TileEmployee.name, Tile);
  }
  async summarize(): Promise<cnst.TileSummary> {
    return {
      totalTile: await this.Tile.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
