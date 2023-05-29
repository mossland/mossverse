import * as ShipInfo from "./shipInfo.document";
import * as cnst from "../cnst";
import { Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ShipInfoEmployee extends LoadService<ShipInfo.Mdl, ShipInfo.Doc, ShipInfo.Input> {
  constructor(
    @InjectModel(ShipInfo.name)
    private readonly ShipInfo: ShipInfo.Mdl
  ) {
    super(ShipInfoEmployee.name, ShipInfo);
  }

  async getShipInfo(userId: Id, productId: Id): Promise<ShipInfo.Doc> {
    return this.ShipInfo.pickOne({
      user: userId,
      product: productId,
      status: { $ne: "inactive" },
    });
  }

  async summarize(): Promise<cnst.ShipInfoSummary> {
    return {
      totalShipInfo: await this.ShipInfo.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
