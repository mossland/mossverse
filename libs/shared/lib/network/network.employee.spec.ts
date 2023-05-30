import { NetworkEmployee } from "./network.employee";
import { TestSystem } from "@shared/test-server";
import { environment } from "../env/environment";

import * as cnst from "../cnst";
import * as db from "../db";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Network Service", () => {
  const system = new TestSystem();
  let networkEmployee: NetworkEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    networkEmployee = app.get<NetworkEmployee>(NetworkEmployee);
  });
  afterAll(async () => await system.terminate());
  let network: db.Network.Doc;
  let input: cnst.NetworkInput;
  it("Create Network", async () => {
    input = sample.networkInput("ethereum");
    network = await networkEmployee.create(input);
    expect(network.status).toEqual("active");
    expect(network).toEqual(expect.objectContaining(input));
  });
  it("Update Network", async () => {
    input = sample.networkInput("ethereum");
    network = await networkEmployee.update(network._id, input);
    expect(network).toEqual(expect.objectContaining(input));
  });
  it("Remove Network", async () => {
    network = await networkEmployee.remove(network._id);
    expect(network.status).toEqual("inactive");
  });
});
