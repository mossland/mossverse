import * as Map from "./map.document";
import * as cnst from "../cnst";
import { AssetEmployee } from "../asset/asset.employee";
import { DialogEmployee } from "../dialog/dialog.employee";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";
import { emp as shared } from "@shared/server";
@Injectable()
export class MapEmployee extends LoadService<Map.Mdl, Map.Doc, Map.Input> {
  constructor(
    @InjectModel(Map.name) private readonly Map: Map.Mdl,
    private readonly assetEmployee: AssetEmployee,
    private readonly dialogEmployee: DialogEmployee,
    private readonly fileEmployee: shared.FileEmployee
  ) {
    super(MapEmployee.name, Map);
  }
  async summarize(): Promise<cnst.MapSummary> {
    return {
      totalMap: await this.Map.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
