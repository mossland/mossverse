import { TestSystem } from "@shared/test-server";
import { environment } from "../env/environment";

import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { registerModules } from "../server";

import { AssetEmployee } from "./asset.employee";

describe("Asset Service", () => {
  const system = new TestSystem();
  let assetEmployee: AssetEmployee;
  let file: db.shared.File.Doc;
  let map: db.Map.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    assetEmployee = app.get<AssetEmployee>(AssetEmployee);
    file = await sample.shared.createFile(app);
    map = await sample.createMap(app, file._id);
  });
  afterAll(async () => await system.terminate());
  let asset: db.Asset.Doc;
  let input: cnst.AssetInput;
  it("Create Asset", async () => {
    input = sample.assetInput(file._id, file._id, file._id);
    asset = await assetEmployee.create(input);
    expect(asset.status).toEqual("active");
    expect(asset).toEqual(expect.objectContaining(input));
  });
  it("Update Asset", async () => {
    input = sample.assetInput(file._id, file._id, file._id);
    asset = await assetEmployee.update(asset._id, input);
    expect(asset).toEqual(expect.objectContaining(input));
  });
  // it("Add Asset to the Map", async () => {
  //   // ! Add asset to the map
  // });
  // it("Interactions are embedded to the map", async () => {});
  it("Remove Asset", async () => {
    asset = await assetEmployee.remove(asset._id);
    expect(asset.status).toEqual("inactive");
  });
  // it("Map's asset and interactions are removed", async () => {});
});
