import * as Live from "./live.document";
import * as cnst from "../cnst";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";

@Injectable()
export class LiveEmployee extends LoadService<Live.Mdl, Live.Doc, Live.Input> {
  constructor(
    @InjectModel(Live.name)
    private readonly Live: Live.Mdl
  ) {
    super(LiveEmployee.name, Live);
  }
  async summarize(): Promise<cnst.LiveSummary> {
    return {
      totalLive: await this.Live.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
