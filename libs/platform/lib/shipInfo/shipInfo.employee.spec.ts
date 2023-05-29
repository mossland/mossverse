import { ShipInfoEmployee } from "./shipInfo.employee";
import { TestSystem } from "@shared/test-server";

import * as cnst from "../cnst";
import * as db from "../db";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("ShipInfo Service", () => {
  const system = new TestSystem();
  let shipInfoEmployee: ShipInfoEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    shipInfoEmployee = app.get<ShipInfoEmployee>(ShipInfoEmployee);
  });
  afterAll(async () => await system.terminate());
  let shipInfo: db.ShipInfo.Doc;

  let input: cnst.ShipInfoInput;
  it("Create ShipInfo", async () => {
    input = sample.shipInfoInput();
    shipInfo = await shipInfoEmployee.create(input);
    expect(shipInfo.status).toEqual("active");
  });
  it("Update ShipInfo", async () => {
    input = sample.shipInfoInput();
    shipInfo = await shipInfoEmployee.update(shipInfo._id, input);
  });
  it("Remove ShipInfo", async () => {
    shipInfo = await shipInfoEmployee.remove(shipInfo._id);
    expect(shipInfo.status).toEqual("inactive");
  });
});
