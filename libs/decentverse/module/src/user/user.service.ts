import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as User from "./user.model";
import { LoadService } from "@shared/util-server";
import { GetObject, Utils } from "@shared/util";
import { srv as shared } from "@shared/module";
import * as gql from "../gql";

@Injectable()
export class UserService<
    Mdl extends User.Mdl = User.Mdl,
    Doc extends User.Doc = User.Doc,
    Input extends User.Input = User.Input
  >
  extends LoadService<Mdl, Doc, Input>
  implements GetObject<shared.UserService<Mdl, Doc, Input>>
{
  constructor(
    @InjectModel(User.name) readonly User: Mdl,
    // ================= Library Import Zone ================= //
    private readonly keyringService: shared.KeyringService // ================= Library Import Zone ================= //
  ) {
    super(UserService.name, User);
  }
  async summarizeDecentverse(): Promise<gql.DecentverseUserSummary> {
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
> extends GetObject<shared.UserService<Mdl, Doc, Input>> {}
Utils.applyMixins(UserService, [shared.UserService]);
