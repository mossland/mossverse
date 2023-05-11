import { PlacementService } from "./placement.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Placement Service", () => {
  const system = new TestSystem();
  let placementService: PlacementService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    placementService = app.get<PlacementService>(PlacementService);
  });
  afterAll(async () => await system.terminate());
  let placement: db.Placement.Doc;

  let input: gql.PlacementInput;
  it("Create Placement", async () => {
    input = sample.placementInput();
    placement = await placementService.create(input);
    expect(placement.status).toEqual("active");
  });
  it("Update Placement", async () => {
    input = sample.placementInput();
    placement = await placementService.update(placement._id, input);
  });
  it("Remove Placement", async () => {
    placement = await placementService.remove(placement._id);
    expect(placement.status).toEqual("inactive");
  });
});
