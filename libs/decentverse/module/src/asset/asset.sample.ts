import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const assetInput = (top: Id, bottom: Id, lighting: Id): gql.AssetInput => ({
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
  const assetService = app.get<srv.AssetService>(srv.AssetService);
  const asset = await assetService.create(assetInput(fileId, fileId, fileId));
  return asset;
};
