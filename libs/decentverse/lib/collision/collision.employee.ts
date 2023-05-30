import * as Collision from "./collision.document";
import * as cnst from "../cnst";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";

@Injectable()
export class CollisionEmployee extends LoadService<Collision.Mdl, Collision.Doc, Collision.Input> {
  constructor(
    @InjectModel(Collision.name)
    private readonly Collision: Collision.Mdl
  ) {
    super(CollisionEmployee.name, Collision);
  }
  async summarize(): Promise<cnst.CollisionSummary> {
    return {
      totalCollision: await this.Collision.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
