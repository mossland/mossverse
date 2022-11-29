import { TestSystem } from "@shared/test-server";

import { registerModules } from "../module";
import * as srv from "../srv";
import * as gql from "../gql";
import * as sample from "../sample";
import * as db from "../db";

import { AssetService } from "./asset.service";

describe("Asset Service", () => {
  const system = new TestSystem();
  let assetService: AssetService;
  let file: db.shared.File.Doc;
  let map: db.Map.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules);
    assetService = app.get<AssetService>(AssetService);
    file = await sample.shared.createFile(app);
    map = await sample.createMap(app, file._id);
  });
  afterAll(async () => await system.terminate());
  let asset: db.Asset.Doc;
  let input: gql.AssetInput;
  it("Create Asset", async () => {
    input = sample.assetInput(file._id, file._id, file._id);
    asset = await assetService.create(input);
    expect(asset.status).toEqual("active");
    expect(asset).toEqual(expect.objectContaining(input));
  });
  it("Update Asset", async () => {
    input = sample.assetInput(file._id, file._id, file._id);
    asset = await assetService.update(asset._id, input);
    expect(asset).toEqual(expect.objectContaining(input));
  });
  // it("Add Asset to the Map", async () => {
  //   // ! Add asset to the map
  // });
  // it("Interactions are embedded to the map", async () => {});
  it("Remove Asset", async () => {
    asset = await assetService.remove(asset._id);
    expect(asset.status).toEqual("inactive");
  });
  // it("Map's asset and interactions are removed", async () => {});
});
