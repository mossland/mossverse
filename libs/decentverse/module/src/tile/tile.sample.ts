import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const tileInput = (): gql.TileInput => ({} as any);

export const createTile = async (app: TestingModule) => {
  const tileService = app.get<srv.TileService>(srv.TileService);
  const tile = await tileService.create(tileInput());
  return tile;
};
