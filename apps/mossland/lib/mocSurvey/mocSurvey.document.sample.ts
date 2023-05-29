import Chance from "chance";
import * as cnst from "../cnst";
import { Id } from "@util/server";
import { MocSurveyEmployee } from "./mocSurvey.employee";
import { TestingModule } from "@nestjs/testing";
import { Utils } from "@util/server";
const c = new Chance();
export const mocSurveyInput = (thing: Id, creator: Id): cnst.MocSurveyInput => ({
  title: c.sentence(),
  description: c.sentence(),
  type: "objective",
  selections: [c.sentence(), c.sentence(), c.sentence(), c.sentence()],
  creator,
  policy: [],
  closeAt: Utils.getLastDays(-2),
  openAt: Utils.getLastDays(-1),
});
export const UserSurveyResponseInput = (user: Id): cnst.platform.UserSurveyResponseInput => ({
  user,
  answer: c.sentence(),
  selection: Utils.randomPick([0, 1, 2, 3]),
  reason: c.sentence(),
});
export const createSurvey = async (app: TestingModule, contractId: Id, creator: Id) => {
  const mocSurveyEmployee = app.get<MocSurveyEmployee>(MocSurveyEmployee);
  const mocSurvey = await mocSurveyEmployee.create(mocSurveyInput(contractId, creator));
  return mocSurvey;
};
