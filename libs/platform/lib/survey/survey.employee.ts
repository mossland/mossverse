import * as Survey from "./survey.document";
import * as cnst from "../cnst";
import { Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { SnapshotEmployee } from "../snapshot/snapshot.employee";
import { emp as shared } from "@shared/server";
@Injectable()
export class SurveyEmployee extends LoadService<Survey.Mdl, Survey.Doc, Survey.Input> {
  constructor(
    @InjectModel(Survey.name)
    private readonly Survey: Survey.Mdl,
    private readonly contractEmployee: shared.ContractEmployee,
    private readonly walletEmployee: shared.WalletEmployee,
    private readonly ownershipEmployee: shared.OwnershipEmployee,
    private readonly snapshotEmployee: SnapshotEmployee
  ) {
    super(SurveyEmployee.name, Survey);
  }

  async createAndOpenSurvey(data: cnst.SurveyInput) {
    const survey = await this.Survey.create(data);
    return survey.merge({ status: "surveying" }).save();
  }

  async generateSurvey(data: cnst.SurveyInput, address: string) {
    const wallet = await this.walletEmployee.get(data.creator as Id);
    wallet.check(address);
    if (
      !this.ownershipEmployee.exists({
        contract: data.contract,
        wallet: data.creator,
      })
    )
      throw new Error("Wallet does not own Token");
    return await this.Survey.create(data);
  }
  async openSurvey(surveyId: Id, address: string) {
    const survey = await this.Survey.pickById(surveyId);
    const wallet = await this.walletEmployee.get(survey.creator);
    if (wallet.address !== address) throw new Error("Different Wallet");
    else if (survey.status !== "applied") throw new Error("Unable to Open");
    return await survey.merge({ status: "surveying" }).save();
  }
  async respondSurvey(surveyId: Id, response: cnst.SurveyResponseInput, address: string) {
    const survey = await this.Survey.pickById(surveyId);
    const wallet = await this.walletEmployee.get(response.wallet);
    if (wallet.address !== address) throw new Error("Different Wallet");
    else if (survey.openAt.getTime() > Date.now() || survey.closeAt.getTime() < Date.now())
      throw new Error("Survey is Not Opened in Time");
    const contractPower = await this.ownershipEmployee.getContractPower(survey.contract, response.wallet);
    return await survey.addResponse({ ...response, ...contractPower }).save();
  }
  async closeSurvey(surveyId: Id) {
    const survey = await this.Survey.pickById(surveyId);
    if (survey.closeAt.getTime() > Date.now()) throw new Error("Survey is Not in Close Time");
    const snapshot = await this.snapshotEmployee.takeContractSnapshot(
      "non-periodic",
      survey.contract,
      survey.responses.map((r) => r.wallet)
    );
    return await survey.close(snapshot).save();
  }
  async update(surveyId: Id, data: cnst.SurveyInput) {
    const survey = await this.Survey.pickById(surveyId);
    if (survey.status !== "applied") throw new Error("Opened Survey cannot be Modified");
    return await survey.merge(data).save();
  }
  async getSnapshot(contractId: Id) {
    const snapshot = (await this.Survey.findById(contractId).select("snapshot"))?.snapshot;
    if (!snapshot) throw new Error("No Snapshot");
    return snapshot;
  }
  async checkExpiredSurveyAll() {
    const surveys = await this.Survey.find({ status: "surveying" });
    this.logger.verbose(`survey expired check start`);
    this.logger.verbose(`found ${surveys.length} active surveys.`);
    for (const survey of surveys) {
      if (survey.closeAt.getTime() < new Date().getTime()) await survey.merge({ status: "closed" }).save();
    }
    this.logger.verbose(`survey expired check end`);
  }
  async summarize(): Promise<cnst.SurveySummary> {
    return {
      totalSurvey: await this.Survey.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
