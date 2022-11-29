import { forwardRef, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as User from "./user.model";

import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { Id, LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import { Types } from "mongoose";

@Injectable()
export class UserService<
    Mdl extends User.Mdl = User.Mdl,
    Doc extends User.Doc = User.Doc,
    Input extends User.Input = User.Input
  >
  extends LoadService<Mdl, Doc, Input>
  implements
    srv.shared.UserService<Mdl, Doc, Input>,
    srv.platform.UserService<Mdl, Doc, Input>,
    srv.decentverse.UserService<Mdl, Doc, Input>
{
  root: Doc;
  constructor(@InjectModel(User.name) readonly User: Mdl) {
    super(UserService.name, User);
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserService<
  Mdl extends User.Mdl = User.Mdl,
  Doc extends User.Doc = User.Doc,
  Input extends User.Input = User.Input
> extends srv.shared.UserService<Mdl, Doc, Input>,
    srv.platform.UserService<Mdl, Doc, Input>,
    srv.decentverse.UserService<Mdl, Doc, Input> {}
Utils.applyMixins(UserService, [srv.shared.UserService, srv.platform.UserService, srv.decentverse.UserService]);
