import * as cnst from "../cnst";
import * as emp from "../emp";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const summaryInput = (): cnst.SummaryInput => ({} as any);

export const createSummary = async (app: TestingModule) => {
  const summaryEmployee = app.get<emp.SummaryEmployee>(emp.SummaryEmployee);
  const summary = await summaryEmployee.create(summaryInput());
  return summary;
};
