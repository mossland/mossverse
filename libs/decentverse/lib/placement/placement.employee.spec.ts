import { PlacementEmployee } from "./placement.employee";
import { TestSystem } from "@shared/test-server";

import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Placement Service", () => {
  const system = new TestSystem();
  let placementEmployee: PlacementEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    placementEmployee = app.get<PlacementEmployee>(PlacementEmployee);
  });
  afterAll(async () => await system.terminate());
  let placement: db.Placement.Doc;

  let input: cnst.PlacementInput;
  it("Create Placement", async () => {
    input = sample.placementInput();
    placement = await placementEmployee.create(input);
    expect(placement.status).toEqual("active");
  });
  it("Update Placement", async () => {
    input = sample.placementInput();
    placement = await placementEmployee.update(placement._id, input);
  });
  it("Remove Placement", async () => {
    placement = await placementEmployee.remove(placement._id);
    expect(placement.status).toEqual("inactive");
  });
});
