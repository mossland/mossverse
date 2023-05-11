import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Asset from "./asset.model";
import * as gql from "../gql";
import * as db from "../db";
import { srv as shared } from "@shared/module";
import { LoadService } from "@shared/util-server";

@Injectable()
export class AssetService extends LoadService<Asset.Mdl, Asset.Doc, Asset.Input> {
  constructor(
    @InjectModel(Asset.name) private readonly Asset: Asset.Mdl,
    private readonly fileService: shared.FileService
  ) {
    super(AssetService.name, Asset);
  }
  override async create(data: Asset.Input) {
    const files = (
      await Promise.all([
        this.fileService.load(data.top),
        this.fileService.load(data.wall),
        this.fileService.load(data.bottom),
        this.fileService.load(data.lighting),
      ])
    ).filter((f) => !!f);
    if (
      !files.every(
        (file) =>
          file && files[0] && file.imageSize[0] === files[0].imageSize[0] && file.imageSize[1] === files[0].imageSize[1]
      ) ||
      !files[0]
    )
      throw new Error("Image size is Different");
    return await new this.Asset({ ...data, wh: files[0].imageSize }).save();
  }
  async summarize(): Promise<gql.AssetSummary> {
    return {
      totalAsset: await this.Asset.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
