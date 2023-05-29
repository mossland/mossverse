import * as Placement from "./placement.document";
import * as cnst from "../cnst";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";

@Injectable()
export class PlacementEmployee extends LoadService<Placement.Mdl, Placement.Doc, Placement.Input> {
  constructor(
    @InjectModel(Placement.name)
    private readonly Placement: Placement.Mdl
  ) {
    super(PlacementEmployee.name, Placement);
  }
  async summarize(): Promise<cnst.PlacementSummary> {
    return {
      totalPlacement: await this.Placement.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
