import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Teleport from "./teleport.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";

@Injectable()
export class TeleportService extends LoadService<Teleport.Mdl, Teleport.Doc, Teleport.Input> {
  constructor(
    @InjectModel(Teleport.name)
    private readonly Teleport: Teleport.Mdl
  ) {
    super(TeleportService.name, Teleport);
  }
  async summarize(): Promise<gql.TeleportSummary> {
    return {
      totalTeleport: await this.Teleport.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
