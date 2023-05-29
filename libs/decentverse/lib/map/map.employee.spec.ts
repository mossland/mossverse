import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { MapEmployee } from "./map.employee";
import { TestSystem } from "@shared/test-server";
import { environment } from "../env/environment";
import { registerModules } from "../server";

describe("Map Service", () => {
  const system = new TestSystem();
  let mapEmployee: MapEmployee;
  let file: db.shared.File.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    mapEmployee = app.get<MapEmployee>(MapEmployee);
    file = await sample.shared.createFile(app);
  });
  afterAll(async () => await system.terminate());
  let map: db.Map.Doc;
  let input: cnst.MapInput;
  it("Create Map", async () => {
    input = sample.mapInput(file._id);
    map = await mapEmployee.create(input);
    expect(map.status).toEqual("active");
  });
  it("Update Map", async () => {
    input = sample.mapInput(map._id);
    map = await mapEmployee.update(map._id, input);
  });
  it("Remove Map", async () => {
    map = await mapEmployee.remove(map._id);
    expect(map.status).toEqual("inactive");
  });
});
