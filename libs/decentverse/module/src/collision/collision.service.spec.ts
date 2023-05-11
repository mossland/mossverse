import { CollisionService } from "./collision.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Collision Service", () => {
  const system = new TestSystem();
  let collisionService: CollisionService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    collisionService = app.get<CollisionService>(CollisionService);
  });
  afterAll(async () => await system.terminate());
  let collision: db.Collision.Doc;

  let input: gql.CollisionInput;
  it("Create Collision", async () => {
    input = sample.collisionInput();
    collision = await collisionService.create(input);
    expect(collision.status).toEqual("active");
  });
  it("Update Collision", async () => {
    input = sample.collisionInput();
    collision = await collisionService.update(collision._id, input);
  });
  it("Remove Collision", async () => {
    collision = await collisionService.remove(collision._id);
    expect(collision.status).toEqual("inactive");
  });
});
