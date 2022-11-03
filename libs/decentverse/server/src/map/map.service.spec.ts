import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../modules";
import { MapService } from "./map.service";
import { TestSystem } from "@shared/test-server";

describe("Map Service", () => {
  const system = new TestSystem();
  let mapService: MapService;
  let file: db.shared.File.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules);
    mapService = app.get<MapService>(MapService);
    file = await sample.shared.createFile(app);
  });
  afterAll(async () => await system.terminate());
  let map: db.Map.Doc;
  let input: gql.MapInput;
  it("Create Map", async () => {
    input = sample.mapInput(file._id);
    map = await mapService.create(input);
    expect(map.status).toEqual("active");
  });
  it("Update Map", async () => {
    input = sample.mapInput(map._id);
    map = await mapService.update(map._id, input);
  });
  it("Remove Map", async () => {
    map = await mapService.remove(map._id);
    expect(map.status).toEqual("inactive");
  });
});
