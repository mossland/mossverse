import * as db from "../db";
import * as cnst from "../cnst";
import { SummaryEmployee } from "./summary.employee";
import { TestSystem } from "@shared/test-server";
import { environment } from "../env/environment";
import { registerModules } from "../server";
describe("Summary Service", () => {
  const system = new TestSystem();
  let summaryEmployee: SummaryEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    summaryEmployee = app.get<SummaryEmployee>(SummaryEmployee);
  });
  afterAll(async () => await system.terminate());
  let summary: db.Summary.Doc;
  let input: cnst.SummaryInput;
  // it("Create Summary", async () => {
  //   input = sample.summaryInput();
  //   summary = await summaryEmployee.create(input);
  //   expect(summary.status).toEqual("active");
  // });
  // it("Update Summary", async () => {
  //   input = sample.summaryInput();
  //   summary = await summaryEmployee.update(summary._id, input);
  // });
  // it("Remove Summary", async () => {
  //   summary = await summaryEmployee.remove(summary._id);
  //   expect(summary.status).toEqual("inactive");
  // });
});
