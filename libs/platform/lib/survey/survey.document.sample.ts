import * as cnst from "../cnst";
import * as emp from "../emp";
import { Id, Utils } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const surveyInput = (contract: Id, creator: Id): cnst.SurveyInput => ({
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
export const surveyResponseInput = (wallet: Id): cnst.SurveyResponseInput => ({
  wallet,
  answer: c.sentence(),
  selection: Utils.randomPick([0, 1, 2, 3]),
  reason: c.sentence(),
});
export const createSurvey = async (app: TestingModule, contractId: Id, creator: Id) => {
  const surveyEmployee = app.get<emp.SurveyEmployee>(emp.SurveyEmployee);
  const survey = await surveyEmployee.create(surveyInput(contractId, creator));
  return survey;
};
