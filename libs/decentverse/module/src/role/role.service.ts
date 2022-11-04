import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Role from "./role.model";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { LoadService } from "@shared/util-server";

@Injectable()
export class RoleService extends LoadService<Role.Mdl, Role.Doc, Role.Input> {
  constructor(@InjectModel(Role.name) private readonly Role: Role.Mdl) {
    super(RoleService.name, Role);
  }
}
