import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Id, LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as User from "./user.model";
import * as gql from "../gql";
import * as srv from "../srv";

@Injectable()
export class UserService<
  Mdl extends User.Mdl = User.Mdl,
  Doc extends User.Doc = User.Doc,
  Input extends User.Input = User.Input
> extends LoadService<Mdl, Doc, Input> implements srv.shared.UserService<Mdl, Doc, Input>, OnModuleInit {
  root: Doc;
  constructor(@InjectModel(User.name) readonly User: Mdl) {
    super(UserService.name, User);
  }
  async onModuleInit() {
    this.root =
      (await this.User.findOne({ role: "root" })) ?? (await this.whoAmI(new Id(), { role: "root" } as Partial<Doc>));
  }
  async exchangeItems(fromId: Id, toId: Id, exchanges: gql.ExchangeInput[]) {
    const [from, to] = await this.loadMany([fromId, toId]);
    from.decItems(exchanges);
    to.incItems(exchanges);
    return await Promise.all([from.save(), to.save()]);
  }
  async changeItems(userId: Id, exchanges: gql.ExchangeInput[]) {
    const user = await this.get(userId);
    return await user.incItems(exchanges).save();
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserService<
  Mdl extends User.Mdl = User.Mdl,
  Doc extends User.Doc = User.Doc,
  Input extends User.Input = User.Input
> extends srv.shared.UserService<Mdl, Doc, Input> {}
Utils.applyMixins(UserService, [srv.shared.UserService]);
