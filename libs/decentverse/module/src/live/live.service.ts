import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Live from "./live.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";

@Injectable()
export class LiveService extends LoadService<Live.Mdl, Live.Doc, Live.Input> {
  constructor(
    @InjectModel(Live.name)
    private readonly Live: Live.Mdl
  ) {
    super(LiveService.name, Live);
  }
  async summarize(): Promise<gql.LiveSummary> {
    return {
      totalLive: await this.Live.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
