import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as ShipInfo from "./shipInfo.model";
import * as fs from "fs";
import { Id, LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";

@Injectable()
export class ShipInfoService extends LoadService<ShipInfo.Mdl, ShipInfo.Doc, ShipInfo.Input> {
  constructor(
    @InjectModel(ShipInfo.name)
    private readonly ShipInfo: ShipInfo.Mdl
  ) {
    super(ShipInfoService.name, ShipInfo);
  }

  async getShipInfo(userId: Id, productId: Id): Promise<ShipInfo.Doc> {
    return this.ShipInfo.pickOne({ user: userId, product: productId, status: { $ne: "inactive" } });
  }

  async summarize(): Promise<gql.ShipInfoSummary> {
    return {
      totalShipInfo: await this.ShipInfo.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
