import * as User from "./user.document";
import * as cnstt from "../cnst";
import { Id, LoadConfig, LoadService, Utils, cnst } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { OwnershipEmployee } from "../ownership/ownership.employee";

@Injectable()
export class UserEmployee<
  Mdl extends User.Mdl = User.Mdl,
  Doc extends User.Doc = User.Doc,
  Input extends User.Input = User.Input
> extends LoadService<Mdl, Doc, Input> {
  constructor(@InjectModel(User.name) User: Mdl, private readonly ownershipEmployee: OwnershipEmployee) {
    super(UserEmployee.name, User);
  }
  async generateWithKeyring(keyringId: Id, data: Partial<User.Doc>): Promise<Doc> {
    return (
      ((await this.model.findOne({
        keyring: keyringId,
        status: "active",
      })) as Doc) ??
      (await new this.model({
        keyring: keyringId,
        ...data,
        roles: ["user"],
      }).save())
    );
  }
  override async remove(userId: Id, config: LoadConfig<Doc> = {}): Promise<Doc> {
    const user = await this.model.pickById(userId);
    await this.ownershipEmployee.removeOwnershipsByUser(user._id);
    return (await user.merge({ status: "inactive" }).save()) as Doc;
  }
  async addUserRole(userId: Id, role: cnst.UserRole): Promise<Doc> {
    const user = await this.model.pickById(userId);
    await user.addRole(role).save();
    await this.model.addSummary(role);
    return user as Doc;
  }
  async subUserRole(userId: Id, role: cnst.UserRole): Promise<Doc> {
    const user = await this.model.pickById(userId);
    await user.subRole(role).save();
    await this.model.subSummary(role);
    return user as Doc;
  }
  async restrictUser(userId: Id, restrictReason: string, restrictUntil?: Date): Promise<Doc> {
    const user = await this.model.pickById(userId);
    await user.merge({ status: "restricted", restrictReason, restrictUntil }).save();
    await this.model.moveSummary("active", "restricted");
    return user as Doc;
  }
  async releaseUser(userId: Id): Promise<Doc> {
    const user = await this.model.pickById(userId);
    if (user.status !== "restricted") throw new Error("User is not restricted");
    await user
      .merge({
        status: "active",
        restrictReason: undefined,
        restrictUntil: undefined,
      })
      .save();
    await this.model.moveSummary("restricted", "active");
    return user as Doc;
  }
  async summarizeShared(): Promise<cnstt.UserSummary> {
    return {
      totalUser: await this.model.countDocuments({
        status: { $ne: "inactive" },
      }),
      restrictedUser: await this.model.countDocuments({ status: "restricted" }),
      businessUser: await this.model.countDocuments({ roles: "business" }),
      hau: await this.model.countDocuments({
        lastLoginAt: { $gte: Utils.getLastHour() },
      }),
      dau: await this.model.countDocuments({
        lastLoginAt: { $gte: Utils.getLastDays() },
      }),
      wau: await this.model.countDocuments({
        lastLoginAt: { $gte: Utils.getLastWeeks() },
      }),
      mau: await this.model.countDocuments({
        lastLoginAt: { $gte: Utils.getLastMonths() },
      }),
    };
  }
}
