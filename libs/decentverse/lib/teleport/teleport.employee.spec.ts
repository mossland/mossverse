import { TeleportEmployee } from "./teleport.employee";
import { TestSystem } from "@shared/test-server";

import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Teleport Service", () => {
  const system = new TestSystem();
  let teleportEmployee: TeleportEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    teleportEmployee = app.get<TeleportEmployee>(TeleportEmployee);
  });
  afterAll(async () => await system.terminate());
  let teleport: db.Teleport.Doc;

  let input: cnst.TeleportInput;
  it("Create Teleport", async () => {
    input = sample.teleportInput();
    teleport = await teleportEmployee.create(input);
    expect(teleport.status).toEqual("active");
  });
  it("Update Teleport", async () => {
    input = sample.teleportInput();
    teleport = await teleportEmployee.update(teleport._id, input);
  });
  it("Remove Teleport", async () => {
    teleport = await teleportEmployee.remove(teleport._id);
    expect(teleport.status).toEqual("inactive");
  });
});
