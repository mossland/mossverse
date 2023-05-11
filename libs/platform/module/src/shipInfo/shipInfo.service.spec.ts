import { ShipInfoService } from "./shipInfo.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("ShipInfo Service", () => {
  const system = new TestSystem();
  let shipInfoService: ShipInfoService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    shipInfoService = app.get<ShipInfoService>(ShipInfoService);
  });
  afterAll(async () => await system.terminate());
  let shipInfo: db.ShipInfo.Doc;

  let input: gql.ShipInfoInput;
  it("Create ShipInfo", async () => {
    input = sample.shipInfoInput();
    shipInfo = await shipInfoService.create(input);
    expect(shipInfo.status).toEqual("active");
  });
  it("Update ShipInfo", async () => {
    input = sample.shipInfoInput();
    shipInfo = await shipInfoService.update(shipInfo._id, input);
  });
  it("Remove ShipInfo", async () => {
    shipInfo = await shipInfoService.remove(shipInfo._id);
    expect(shipInfo.status).toEqual("inactive");
  });
});
