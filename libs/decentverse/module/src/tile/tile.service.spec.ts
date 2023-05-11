import { TileService } from "./tile.service";
import { TestSystem } from "@shared/test-server";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Tile Service", () => {
  const system = new TestSystem();
  let tileService: TileService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    tileService = app.get<TileService>(TileService);
  });
  afterAll(async () => await system.terminate());
  let tile: db.Tile.Doc;

  let input: gql.TileInput;
  it("Create Tile", async () => {
    input = sample.tileInput();
    tile = await tileService.create(input);
    expect(tile.status).toEqual("active");
  });
  it("Update Tile", async () => {
    input = sample.tileInput();
    tile = await tileService.update(tile._id, input);
  });
  it("Remove Tile", async () => {
    tile = await tileService.remove(tile._id);
    expect(tile.status).toEqual("inactive");
  });
});
