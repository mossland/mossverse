import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Map from "./map.model";
import * as db from "../db";
import * as gql from "../gql";
import { srv as shared } from "@shared/module";
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
    private readonly fileService: shared.FileService
  ) {
    super(MapService.name, Map);
  }
  async summarize(): Promise<gql.MapSummary> {
    return {
      totalMap: await this.Map.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
