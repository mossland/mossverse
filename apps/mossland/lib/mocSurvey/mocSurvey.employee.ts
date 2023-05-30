import * as MocSurvey from "./mocSurvey.document";
import * as cnst from "../cnst";
import * as doc from "../doc";
import { Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { UserEmployee } from "../user/user.employee";
import { emp as shared } from "@shared/server";

@Injectable()
export class MocSurveyEmployee extends LoadService<MocSurvey.Mdl, MocSurvey.Doc, MocSurvey.Input> {
  private mmoc: doc.shared.Thing.Doc;
  constructor(
    @InjectModel(MocSurvey.name)
    private readonly MocSurvey: MocSurvey.Mdl,
    private readonly userEmployee: UserEmployee,
    private readonly keyringEmployee: shared.KeyringEmployee,
    private readonly thingEmployee: shared.ThingEmployee,
    private readonly ownershipEmployee: shared.OwnershipEmployee
  ) {
    super(MocSurveyEmployee.name, MocSurvey);
  }
  async onModuleInit() {
    this.mmoc = await this.thingEmployee.generate("MMOC");
  }

  async create(data: cnst.MocSurveyInput) {
    const user = await this.userEmployee.get(data.creator as Id);
    // if (!user.hasItem(this.mmoc._id, 1)) throw new Error("Does not own MMOC");

    return await this.MocSurvey.create({ ...data, thing: this.mmoc._id });
  }

  async generateMocSurvey(data: cnst.MocSurveyInput) {
    const user = await this.userEmployee.get(data.creator as Id);
    // if (!user.hasItem(this.mmoc._id, 1)) throw new Error("Does not own MMOC");
    return await this.MocSurvey.create({ ...data, thing: this.mmoc._id });
  }
  async openMocSurvey(mocSurveyId: Id, keyring: Id) {
    const mocSurvey = await this.MocSurvey.pickById(mocSurveyId);
    const user = await this.userEmployee.get(mocSurvey.creator);
    // if (user.keyring._id !== keyring) throw new Error("Different User");
    if (mocSurvey.status !== "applied") throw new Error("Unable to Open");
    return await mocSurvey.merge({ status: "surveying" }).save();
  }
  async respondMocSurvey(mocSurveyId: Id, response: cnst.platform.UserSurveyResponseInput, keyring: Id) {
    const mocSurvey = await this.MocSurvey.pickById(mocSurveyId);
    const user = await this.userEmployee.get(response.user);
    if (!(await this.ownershipEmployee.hasThing(user._id, this.mmoc._id))) throw new Error("Does not own MMOC");
    const mmoc = await this.ownershipEmployee.get(this.mmoc._id);
    if (!user.keyring.equals(keyring)) throw new Error("Different User");
    else if (mocSurvey.openAt.getTime() > Date.now() || mocSurvey.closeAt.getTime() < Date.now())
      throw new Error("MocSurvey is Not Opened in Time");

    return await mocSurvey.addResponse({ ...response, num: mmoc.value }).save();
  }
  async closeMocSurvey(mocSurveyId: Id) {
    const mocSurvey = await this.MocSurvey.pickById(mocSurveyId);
    if (mocSurvey.closeAt.getTime() > Date.now()) throw new Error("MocSurvey is Not in Close Time");
    const users = await this.userEmployee.list(mocSurvey.getResponseUsers());

    const snapshot: cnst.platform.MocOwnership[] = await Promise.all(
      users.map(async (user) => {
        if (!(await this.ownershipEmployee.hasThing(user._id, this.mmoc._id))) return { user: user._id, num: 0 };
        const mmoc = await this.ownershipEmployee.get(this.mmoc._id);
        return { user: user._id, num: mmoc.value };
      })
    );
    return await mocSurvey.close(snapshot).save();
  }

  async checkExpiredSurveyAll() {
    const mocSurveys = await this.MocSurvey.find({
      status: "surveying",
      closeAt: { $lt: new Date() },
    });
    for (const mocSurvey of mocSurveys) {
      await this.closeMocSurvey(mocSurvey._id);
    }
  }

  async summarize(): Promise<cnst.MocSurveySummary> {
    return {
      totalMocSurvey: await this.MocSurvey.countDocuments({
        status: { $ne: "inactive" },
      }),
      appliedMocSurvey: await this.MocSurvey.countDocuments({
        status: "applied",
      }),
      surveyingMocSurvey: await this.MocSurvey.countDocuments({
        status: "surveying",
      }),
      closedMocSurvey: await this.MocSurvey.countDocuments({
        status: "closed",
      }),
    };
  }
}
