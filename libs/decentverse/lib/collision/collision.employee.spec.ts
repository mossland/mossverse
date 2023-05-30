import { CollisionEmployee } from "./collision.employee";
import { TestSystem } from "@shared/test-server";

import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Collision Service", () => {
  const system = new TestSystem();
  let collisionEmployee: CollisionEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    collisionEmployee = app.get<CollisionEmployee>(CollisionEmployee);
  });
  afterAll(async () => await system.terminate());
  let collision: db.Collision.Doc;

  let input: cnst.CollisionInput;
  it("Create Collision", async () => {
    input = sample.collisionInput();
    collision = await collisionEmployee.create(input);
    expect(collision.status).toEqual("active");
  });
  it("Update Collision", async () => {
    input = sample.collisionInput();
    collision = await collisionEmployee.update(collision._id, input);
  });
  it("Remove Collision", async () => {
    collision = await collisionEmployee.remove(collision._id);
    expect(collision.status).toEqual("inactive");
  });
});
