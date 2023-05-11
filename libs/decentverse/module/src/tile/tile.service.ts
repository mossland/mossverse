import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Tile from "./tile.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";

@Injectable()
export class TileService extends LoadService<Tile.Mdl, Tile.Doc, Tile.Input> {
  constructor(
    @InjectModel(Tile.name)
    private readonly Tile: Tile.Mdl
  ) {
    super(TileService.name, Tile);
  }
  async summarize(): Promise<gql.TileSummary> {
    return {
      totalTile: await this.Tile.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
