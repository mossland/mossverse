import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Asset from "./asset.model";
import * as gql from "../gql";
import * as db from "../db";
import * as srv from "../srv";
import { LoadService } from "@shared/util-server";

@Injectable()
export class AssetService extends LoadService<Asset.Mdl, Asset.Doc, Asset.Input> {
  constructor(
    @InjectModel(Asset.name) private readonly Asset: Asset.Mdl,
    private readonly fileService: srv.shared.FileService
  ) {
    super(AssetService.name, Asset);
  }
  async create(data: Asset.Input) {
    const files = await Promise.all([
      this.fileService.load(data.top),
      this.fileService.load(data.bottom),
      this.fileService.load(data.lighting),
    ]);
    if (
      !files.every(
        (file) =>
          file && files[0] && file.imageSize[0] === files[0].imageSize[0] && file.imageSize[1] === files[0].imageSize[1]
      ) ||
      !files[0]
    )
      throw new Error("Image size is Different");
    return await this.Asset.create({ ...data, wh: files[0].imageSize });
  }
}
