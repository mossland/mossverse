import { environment } from "../_environments/environment";
import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { TestingModule } from "@nestjs/testing";
import { registerModules } from "../module";
import { TestSystem } from "@shared/test-server";
import { SummaryService } from "./summary.service";
describe("Summary Service", () => {
  const system = new TestSystem();
  let summaryService: SummaryService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    summaryService = app.get<SummaryService>(SummaryService);
  });
  afterAll(async () => await system.terminate());
  let summary: db.Summary.Doc;
  let input: gql.SummaryInput;
  // it("Create Summary", async () => {
  //   input = sample.summaryInput();
  //   summary = await summaryService.create(input);
  //   expect(summary.status).toEqual("active");
  // });
  // it("Update Summary", async () => {
  //   input = sample.summaryInput();
  //   summary = await summaryService.update(summary._id, input);
  // });
  // it("Remove Summary", async () => {
  //   summary = await summaryService.remove(summary._id);
  //   expect(summary.status).toEqual("inactive");
  // });
});
