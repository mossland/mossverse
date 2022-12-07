import { environment } from "../_environments/environment";
import { NetworkService } from "./network.service";
import { TestSystem } from "@shared/test-server";
import { NetworkModule } from "./network.module";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Network Service", () => {
  const system = new TestSystem();
  let networkService: NetworkService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    networkService = app.get<NetworkService>(NetworkService);
  });
  afterAll(async () => await system.terminate());
  let network: db.Network.Doc;
  let input: gql.NetworkInput;
  it("Create Network", async () => {
    input = sample.networkInput("ethereum");
    network = await networkService.create(input);
    expect(network.status).toEqual("active");
    expect(network).toEqual(expect.objectContaining(input));
  });
  it("Update Network", async () => {
    input = sample.networkInput("ethereum");
    network = await networkService.update(network._id, input);
    expect(network).toEqual(expect.objectContaining(input));
  });
  it("Remove Network", async () => {
    network = await networkService.remove(network._id);
    expect(network.status).toEqual("inactive");
  });
});
