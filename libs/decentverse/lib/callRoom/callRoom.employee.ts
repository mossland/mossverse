import * as CallRoom from "./callRoom.document";
import * as cnst from "../cnst";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";

@Injectable()
export class CallRoomEmployee extends LoadService<CallRoom.Mdl, CallRoom.Doc, CallRoom.Input> {
  constructor(
    @InjectModel(CallRoom.name)
    private readonly CallRoom: CallRoom.Mdl
  ) {
    super(CallRoomEmployee.name, CallRoom);
  }
  async summarize(): Promise<cnst.CallRoomSummary> {
    return {
      totalCallRoom: await this.CallRoom.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
