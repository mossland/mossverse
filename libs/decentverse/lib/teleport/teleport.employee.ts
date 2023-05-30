import * as Teleport from "./teleport.document";
import * as cnst from "../cnst";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";

@Injectable()
export class TeleportEmployee extends LoadService<Teleport.Mdl, Teleport.Doc, Teleport.Input> {
  constructor(
    @InjectModel(Teleport.name)
    private readonly Teleport: Teleport.Mdl
  ) {
    super(TeleportEmployee.name, Teleport);
  }
  async summarize(): Promise<cnst.TeleportSummary> {
    return {
      totalTeleport: await this.Teleport.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
