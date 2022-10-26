import { Utils } from "@shared/util";
import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as gql from "../gql";
import { MocSurveyService } from "./mocSurvey.service";
const c = new Chance();
export const mocSurveyInput = (thing: Id, creator: Id): gql.MocSurveyInput => ({
  title: c.sentence(),
  description: c.sentence(),
  type: "objective",
  selections: [c.sentence(), c.sentence(), c.sentence(), c.sentence()],
  creator,
  policy: [],
  closeAt: Utils.getLastDays(-2),
  openAt: Utils.getLastDays(-1),
});
export const UserSurveyResponseInput = (user: Id): gql.platform.UserSurveyResponseInput => ({
  user,
  answer: c.sentence(),
  selection: Utils.randomPick([0, 1, 2, 3]),
  reason: c.sentence(),
});
export const createSurvey = async (app: TestingModule, contractId: Id, creator: Id) => {
  const mocSurveyService = app.get<MocSurveyService>(MocSurveyService);
  const mocSurvey = await mocSurveyService.create(mocSurveyInput(contractId, creator));
  return mocSurvey;
};
