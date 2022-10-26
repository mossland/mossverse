import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Thing from "./thing.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
@Injectable()
export class ThingService extends LoadService<Thing.Mdl, Thing.Doc, Thing.Input> {
  constructor(
    @InjectModel(Thing.name)
    private readonly Thing: Thing.Mdl,
    private readonly fileService: srv.FileService
  ) {
    super(ThingService.name, Thing);
  }
  async generate(name: string) {
    return (
      (await this.Thing.findOne({ name })) ??
      (await this.Thing.create({ name, description: name, image: (await this.fileService.generate())._id }))
    );
  }
}
