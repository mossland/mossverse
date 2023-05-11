import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { LoadService, ObjectId, Id } from "@shared/util-server";
import * as gql from "../gql";
import * as Survey from "./survey.model";
import { srv as shared } from "@shared/module";
import { SnapshotService } from "../snapshot/snapshot.service";
@Injectable()
export class SurveyService extends LoadService<Survey.Mdl, Survey.Doc, Survey.Input> {
  constructor(
    @InjectModel(Survey.name)
    private readonly Survey: Survey.Mdl,
    private readonly contractService: shared.ContractService,
    private readonly walletService: shared.WalletService,
    private readonly ownershipService: shared.OwnershipService,
    private readonly snapshotService: SnapshotService
  ) {
    super(SurveyService.name, Survey);
  }

  async createAndOpenSurvey(data: gql.SurveyInput) {
    const survey = await this.Survey.create(data);
    return survey.merge({ status: "opened" }).save();
  }

  async generateSurvey(data: gql.SurveyInput, address: string) {
    const wallet = await this.walletService.get(data.creator as Id);
    wallet.check(address);
    if (!this.ownershipService.exists({ contract: data.contract, wallet: data.creator }))
      throw new Error("Wallet does not own Token");
    return await this.Survey.create(data);
  }
  async openSurvey(surveyId: Id, address: string) {
    const survey = await this.Survey.pickById(surveyId);
    const wallet = await this.walletService.get(survey.creator);
    if (wallet.address !== address) throw new Error("Different Wallet");
    else if (survey.status !== "active") throw new Error("Unable to Open");
    return await survey.merge({ status: "opened" }).save();
  }
  async respondSurvey(surveyId: Id, response: gql.SurveyResponseInput, address: string) {
    const survey = await this.Survey.pickById(surveyId);
    const wallet = await this.walletService.get(response.wallet);
    if (wallet.address !== address) throw new Error("Different Wallet");
    else if (survey.openAt.getTime() > Date.now() || survey.closeAt.getTime() < Date.now())
      throw new Error("Survey is Not Opened in Time");
    const contractPower = await this.ownershipService.getContractPower(survey.contract, response.wallet);
    return await survey.addResponse({ ...response, ...contractPower }).save();
  }
  async closeSurvey(surveyId: Id) {
    const survey = await this.Survey.pickById(surveyId);
    if (survey.closeAt.getTime() > Date.now()) throw new Error("Survey is Not in Close Time");
    const snapshot = await this.snapshotService.takeContractSnapshot(
      "non-periodic",
      survey.contract,
      survey.responses.map((r) => r.wallet)
    );
    return await survey.close(snapshot).save();
  }
  async update(surveyId: Id, data: gql.SurveyInput) {
    const survey = await this.Survey.pickById(surveyId);
    if (survey.status !== "active") throw new Error("Opened Survey cannot be Modified");
    return await survey.merge(data).save();
  }
  async getSnapshot(contractId: Id) {
    const snapshot = (await this.Survey.findById(contractId).select("snapshot"))?.snapshot;
    if (!snapshot) throw new Error("No Snapshot");
    return snapshot;
  }
  async checkExpiredSurveyAll() {
    const surveys = await this.Survey.find({ status: "opened" });
    this.logger.verbose(`survey expired check start`);
    this.logger.verbose(`found ${surveys.length} active surveys.`);
    for (const survey of surveys) {
      if (survey.closeAt.getTime() < new Date().getTime()) await survey.merge({ status: "closed" }).save();
    }
    this.logger.verbose(`survey expired check end`);
  }
  async summarize(): Promise<gql.SurveySummary> {
    return {
      totalSurvey: await this.Survey.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
