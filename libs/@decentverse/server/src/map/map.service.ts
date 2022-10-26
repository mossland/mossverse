import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Map from "./map.model";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { Id, LoadService } from "@shared/util-server";
import { AssetService } from "../asset/asset.service";
import { DialogService } from "../dialog/dialog.service";
import { RoleService } from "../role/role.service";
@Injectable()
export class MapService extends LoadService<Map.Mdl, Map.Doc, Map.Input> {
  constructor(
    @InjectModel(Map.name) private readonly Map: Map.Mdl,
    private readonly assetService: AssetService,
    private readonly dialogService: DialogService,
    private readonly fileService: srv.shared.FileService
  ) {
    super(MapService.name, Map);
  }
  async create(data: Map.Input) {
    const map = await this.Map.create(data);
    const tiles = await this.#organizeTiles(map);
    return await map.merge({ tiles, wh: [data.tileSize * tiles[0].length, data.tileSize * tiles.length] }).save();
  }
  async #organizeTiles(map: Map.Doc) {
    const { top, bottom, lighting, tileSize } = map;
    const topTileImages = top ? await this.fileService.sliceImage(top, tileSize, "map", `${map._id}`) : [];
    const bottomTileImages = await this.fileService.sliceImage(bottom, tileSize, "map", `${map._id}`);
    const lightingTileImages = lighting
      ? await this.fileService.sliceImage(lighting, tileSize, "map", `${map._id}`)
      : [];
    const tiles: gql.TileInput[][] = bottomTileImages.map((images, idx) =>
      images.map((image, idy) => ({
        top: topTileImages[idx]?.[idy]._id,
        bottom: image._id,
        lighting: lightingTileImages[idx]?.[idy]._id,
        collisions: [],
        webviews: [],
        lives: [],
        callRooms: [],
        dialogues: [],
      }))
    );
    return tiles;
  }
  // async addPlacement(mapId: Id, assetId: Id, position: number[]) {
  //   const map = await this.Map.pickById(mapId);
  //   const asset = await this.assetService.get(assetId);
  //   return await map.addPlacement(asset, position).save();
  // }
  // async addCollision(mapId: Id, assetId: Id, position: number[]) {
  //   const map = await this.Map.pickById(mapId);
  //   const asset = await this.assetService.get(assetId);
  //   return await map.addCollision(asset, position).save();
  // }
}
