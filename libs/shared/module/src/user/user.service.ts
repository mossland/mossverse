import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FileUpload } from "graphql-upload";
import { Id, LoadService, ObjectId } from "@shared/util-server";
import { Model, Document } from "mongoose";
import * as User from "./user.model";

export class UserService<
  Mdl extends User.Mdl = User.Mdl,
  Doc extends User.Doc = User.Doc,
  Input extends User.Input = User.Input
> extends LoadService<Mdl, Doc, Input> {
  constructor(@InjectModel(User.name) User: Mdl) {
    super(UserService.name, User);
  }
  async whoAmI(keyringId: Id, data: Partial<Doc> = {}) {
    return (
      ((await this.model.findOne({ keyring: keyringId })) as Doc) ??
      ((await this.model.create({ keyring: keyringId, ...data })) as Doc)
    );
  }
  async resetItemsAll(thingId: Id) {
    const { modifiedCount } = await this.model.updateMany(
      { "items.thing": thingId },
      { $pull: { items: { thing: thingId } } }
    );
    return modifiedCount;
  }
}
