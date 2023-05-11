import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const summaryInput = (): gql.SummaryInput => ({} as any);

export const createSummary = async (app: TestingModule) => {
  const summaryService = app.get<srv.SummaryService>(srv.SummaryService);
  const summary = await summaryService.create(summaryInput());
  return summary;
};
