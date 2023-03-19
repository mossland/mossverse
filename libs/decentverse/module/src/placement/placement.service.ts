import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Placement from "./placement.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";

@Injectable()
export class PlacementService extends LoadService<Placement.Mdl, Placement.Doc, Placement.Input> {
  constructor(
    @InjectModel(Placement.name)
    private readonly Placement: Placement.Mdl
  ) {
    super(PlacementService.name, Placement);
  }
  async summarize(): Promise<gql.PlacementSummary> {
    return {
      totalPlacement: await this.Placement.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
