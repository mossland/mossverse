import * as Asset from "./asset.document";
import * as cnst from "../cnst";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";
import { emp as shared } from "@shared/server";

@Injectable()
export class AssetEmployee extends LoadService<Asset.Mdl, Asset.Doc, Asset.Input> {
  constructor(
    @InjectModel(Asset.name) private readonly Asset: Asset.Mdl,
    private readonly fileEmployee: shared.FileEmployee
  ) {
    super(AssetEmployee.name, Asset);
  }
  override async create(data: Asset.Input) {
    const files = (
      await Promise.all([
        this.fileEmployee.load(data.top),
        this.fileEmployee.load(data.wall),
        this.fileEmployee.load(data.bottom),
        this.fileEmployee.load(data.lighting),
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
  async summarize(): Promise<cnst.AssetSummary> {
    return {
      totalAsset: await this.Asset.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
