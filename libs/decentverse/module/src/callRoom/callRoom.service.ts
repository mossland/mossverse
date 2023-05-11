import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as CallRoom from "./callRoom.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";

@Injectable()
export class CallRoomService extends LoadService<CallRoom.Mdl, CallRoom.Doc, CallRoom.Input> {
  constructor(
    @InjectModel(CallRoom.name)
    private readonly CallRoom: CallRoom.Mdl
  ) {
    super(CallRoomService.name, CallRoom);
  }
  async summarize(): Promise<gql.CallRoomSummary> {
    return {
      totalCallRoom: await this.CallRoom.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
