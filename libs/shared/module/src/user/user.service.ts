import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FileUpload } from "graphql-upload";
import { Account, Id, LoadConfig, LoadService, ObjectId } from "@shared/util-server";
import { Model, Document } from "mongoose";
import * as User from "./user.model";
import { KeyringService } from "../keyring/keyring.service";

export class UserService<
  Mdl extends User.Mdl = User.Mdl,
  Doc extends User.Doc = User.Doc,
  Input extends User.Input = User.Input
> extends LoadService<Mdl, Doc, Input> {
  constructor(@InjectModel(User.name) User: Mdl, private readonly keyringService: KeyringService) {
    super(UserService.name, User);
  }
  async whoAmI(keyringId: Id, data: Partial<Doc> = {}) {
    return (
      ((await this.model.findOne({ keyring: keyringId, status: "active" })) as Doc) ??
      ((await this.model.create({ keyring: keyringId, ...data })) as Doc)
    );
  }
  async remove(userId: Id, { account }: LoadConfig = {}): Promise<Doc> {
    const user = await this.model.pickById(userId);
    if (!account || !user.keyring.equals(account.keyring)) throw new Error("Not authorized");
    await this.keyringService.remove(user.keyring);
    return (await user.merge({ status: "inactive" }).save()) as Doc;
  }
  async resetItemsAll(thingId: Id) {
    const { modifiedCount } = await this.model.updateMany(
      { "items.thing": thingId },
      { $pull: { items: { thing: thingId } } }
    );
    return modifiedCount;
  }
}
