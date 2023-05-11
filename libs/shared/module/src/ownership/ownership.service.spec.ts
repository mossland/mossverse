import { environment } from "../_environments/environment";
import { OwnershipService } from "./ownership.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Ownership Service", () => {
  const system = new TestSystem();
  let ownershipService: OwnershipService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    ownershipService = app.get<OwnershipService>(OwnershipService);
  });
  afterAll(async () => await system.terminate());
  let ownership: db.Ownership.Doc;

  let input: gql.OwnershipInput;
  it("Create Ownership", async () => {
    input = sample.ownershipInput();
    ownership = await ownershipService.create(input);
    expect(ownership.status).toEqual("active");
  });
  it("Update Ownership", async () => {
    input = sample.ownershipInput();
    ownership = await ownershipService.update(ownership._id, input);
  });
  it("Remove Ownership", async () => {
    ownership = await ownershipService.remove(ownership._id);
    expect(ownership.status).toEqual("inactive");
  });
});
