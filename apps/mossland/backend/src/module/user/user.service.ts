import { forwardRef, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as User from "./user.model";
import * as db from "../db";
import * as gql from "../gql";
import { srv as shared } from "@shared/module";
import { srv as platform } from "@platform/module";
import { srv as decentverse } from "@decentverse/module";
import { Id, LoadService } from "@shared/util-server";
import { Utils, GetObject } from "@shared/util";

@Injectable()
export class UserService<
    Mdl extends User.Mdl = User.Mdl,
    Doc extends User.Doc = User.Doc,
    Input extends User.Input = User.Input
  >
  extends LoadService<Mdl, Doc, Input>
  implements
    GetObject<shared.UserService<Mdl, Doc, Input>>,
    GetObject<platform.UserService<Mdl, Doc, Input>>,
    GetObject<decentverse.UserService<Mdl, Doc, Input>>
{
  root: Doc;
  constructor(
    @InjectModel(User.name) readonly User: Mdl,
    // ================= Library Import Zone ================= //
    private readonly keyringService: shared.KeyringService
  ) // ================= Library Import Zone ================= //

  {
    super(UserService.name, User);
  }
  async summarizeMossland(): Promise<gql.MosslandUserSummary> {
    return {
      //
    };
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserService<
  Mdl extends User.Mdl = User.Mdl,
  Doc extends User.Doc = User.Doc,
  Input extends User.Input = User.Input
> extends GetObject<shared.UserService<Mdl, Doc, Input>>,
    GetObject<platform.UserService<Mdl, Doc, Input>>,
    GetObject<decentverse.UserService<Mdl, Doc, Input>> {}
Utils.applyMixins(UserService, [shared.UserService, platform.UserService, decentverse.UserService]);
