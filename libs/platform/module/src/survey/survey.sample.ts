import { Utils } from "@shared/util";
import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const surveyInput = (contract: Id, creator: Id): gql.SurveyInput => ({
  title: c.sentence(),
  content: c.sentence(),
  contract,
  type: "objective",
  selections: [c.sentence(), c.sentence(), c.sentence(), c.sentence()],
  creator,
  policy: [],
  closeAt: Utils.getLastDays(-2),
  openAt: Utils.getLastDays(-1),
});
export const surveyResponseInput = (wallet: Id): gql.SurveyResponseInput => ({
  wallet,
  answer: c.sentence(),
  selection: Utils.randomPick([0, 1, 2, 3]),
  reason: c.sentence(),
});
export const createSurvey = async (app: TestingModule, contractId: Id, creator: Id) => {
  const surveyService = app.get<srv.SurveyService>(srv.SurveyService);
  const survey = await surveyService.create(surveyInput(contractId, creator));
  return survey;
};
