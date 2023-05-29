import * as cnst from "../cnst";
import * as emp from "../emp";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const assetInput = (top: Id, bottom: Id, lighting: Id): cnst.AssetInput => ({
  name: c.word(),
  top,
  bottom,
  lighting,
  // collisions: [],
  // webviews: [],
  // dialogues: [],
  // lives: [],
});
export const createAsset = async (app: TestingModule, fileId: Id) => {
  const assetEmployee = app.get<emp.AssetEmployee>(emp.AssetEmployee);
  const asset = await assetEmployee.create(assetInput(fileId, fileId, fileId));
  return asset;
};
