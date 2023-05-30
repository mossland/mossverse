import { OwnershipEmployee } from "./ownership.employee";
import { TestSystem } from "@shared/test-server";
import { environment } from "../env/environment";

import * as cnst from "../cnst";
import * as db from "../db";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Ownership Service", () => {
  const system = new TestSystem();
  let ownershipEmployee: OwnershipEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    ownershipEmployee = app.get<OwnershipEmployee>(OwnershipEmployee);
  });
  afterAll(async () => await system.terminate());
  let ownership: db.Ownership.Doc;

  let input: cnst.OwnershipInput;
  it("Create Ownership", async () => {
    input = sample.ownershipInput();
    ownership = await ownershipEmployee.create(input);
    expect(ownership.status).toEqual("active");
  });
  it("Update Ownership", async () => {
    input = sample.ownershipInput();
    ownership = await ownershipEmployee.update(ownership._id, input);
  });
  it("Remove Ownership", async () => {
    ownership = await ownershipEmployee.remove(ownership._id);
    expect(ownership.status).toEqual("inactive");
  });
});
