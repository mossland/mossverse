import * as User from "./user.document";
import * as cnst from "../cnst";
import { GetObject, LoadService, Utils } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { emp as shared } from "@shared/server";

@Injectable()
export class UserEmployee<
    Mdl extends User.Mdl = User.Mdl,
    Doc extends User.Doc = User.Doc,
    Input extends User.Input = User.Input
  >
  extends LoadService<Mdl, Doc, Input>
  implements GetObject<shared.UserEmployee<Mdl, Doc, Input>>
{
  root: Doc;
  constructor(
    @InjectModel(User.name) readonly User: Mdl,
    // ================= Library Import Zone ================= //
    private readonly keyringEmployee: shared.KeyringEmployee // ================= Library Import Zone ================= //
  ) {
    super(UserEmployee.name, User);
  }
  // async onModuleInit() {
  //   this.root =
  //     (await this.User.findOne({ role: "root" })) ??
  //     ((await this.keyringEmployee.whoAmI(new Id(), { role: "root" } as Partial<Doc>)) as Doc);
  // }
  // async exchangeItems(fromId: Id, toId: Id, exchanges: cnst.ExchangeInput[]) {
  //   const [from, to] = await this.loadMany([fromId, toId]);
  //   from.decItems(exchanges);
  //   to.incItems(exchanges);
  //   return await Promise.all([from.save(), to.save()]);
  // }
  // async changeItems(userId: Id, exchanges: cnst.ExchangeInput[]) {
  //   const user = await this.get(userId);
  //   return await user.incItems(exchanges).save();
  // }
  async summarizePlatform(): Promise<cnst.PlatformUserSummary> {
    return {
      //
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserEmployee<
  Mdl extends User.Mdl = User.Mdl,
  Doc extends User.Doc = User.Doc,
  Input extends User.Input = User.Input
> extends GetObject<shared.UserEmployee<Mdl, Doc, Input>> {}
Utils.applyMixins(UserEmployee, [shared.UserEmployee]);
