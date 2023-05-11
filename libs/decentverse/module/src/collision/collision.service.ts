import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Collision from "./collision.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";

@Injectable()
export class CollisionService extends LoadService<Collision.Mdl, Collision.Doc, Collision.Input> {
  constructor(
    @InjectModel(Collision.name)
    private readonly Collision: Collision.Mdl
  ) {
    super(CollisionService.name, Collision);
  }
  async summarize(): Promise<gql.CollisionSummary> {
    return {
      totalCollision: await this.Collision.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
