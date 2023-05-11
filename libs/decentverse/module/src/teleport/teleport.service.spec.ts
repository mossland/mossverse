import { TeleportService } from "./teleport.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Teleport Service", () => {
  const system = new TestSystem();
  let teleportService: TeleportService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    teleportService = app.get<TeleportService>(TeleportService);
  });
  afterAll(async () => await system.terminate());
  let teleport: db.Teleport.Doc;

  let input: gql.TeleportInput;
  it("Create Teleport", async () => {
    input = sample.teleportInput();
    teleport = await teleportService.create(input);
    expect(teleport.status).toEqual("active");
  });
  it("Update Teleport", async () => {
    input = sample.teleportInput();
    teleport = await teleportService.update(teleport._id, input);
  });
  it("Remove Teleport", async () => {
    teleport = await teleportService.remove(teleport._id);
    expect(teleport.status).toEqual("inactive");
  });
});
