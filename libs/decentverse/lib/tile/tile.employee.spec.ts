import { TestSystem } from "@shared/test-server";
import { TileEmployee } from "./tile.employee";

import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Tile Service", () => {
  const system = new TestSystem();
  let tileEmployee: TileEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    tileEmployee = app.get<TileEmployee>(TileEmployee);
  });
  afterAll(async () => await system.terminate());
  let tile: db.Tile.Doc;

  let input: cnst.TileInput;
  it("Create Tile", async () => {
    input = sample.tileInput();
    tile = await tileEmployee.create(input);
    expect(tile.status).toEqual("active");
  });
  it("Update Tile", async () => {
    input = sample.tileInput();
    tile = await tileEmployee.update(tile._id, input);
  });
  it("Remove Tile", async () => {
    tile = await tileEmployee.remove(tile._id);
    expect(tile.status).toEqual("inactive");
  });
});
