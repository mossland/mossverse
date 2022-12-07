import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FileUpload } from "graphql-upload";
import { Account, Id, LoadConfig, LoadService, ObjectId } from "@shared/util-server";
import * as User from "./user.model";
import { KeyringService } from "../keyring/keyring.service";

@Injectable()
export class UserService<
  Mdl extends User.Mdl = User.Mdl,
  Doc extends User.Doc = User.Doc,
  Input extends User.Input = User.Input
> extends LoadService<Mdl, Doc, Input> {
  constructor(@InjectModel(User.name) User: Mdl, private readonly keyringService: KeyringService) {
    super(UserService.name, User);
  }
  async whoAmI(keyringId: Id, data: Partial<Doc> = {}) {
    const user =
      ((await this.model.findOne({ keyring: keyringId, status: "active" })) as Doc) ??
      (await new this.model({ keyring: keyringId, ...data }).save());
    if (user.isNew) await this.keyringService.update(user.keyring, { user: user._id });
    return user;
  }
  override async remove(userId: Id, config: LoadConfig<Doc> = {}): Promise<Doc> {
    const user = await this.model.pickById(userId);
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
