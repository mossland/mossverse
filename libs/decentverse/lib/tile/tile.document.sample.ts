import * as cnst from "../cnst";
import * as emp from "../emp";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const tileInput = (): cnst.TileInput => ({} as any);

export const createTile = async (app: TestingModule) => {
  const tileEmployee = app.get<emp.TileEmployee>(emp.TileEmployee);
  const tile = await tileEmployee.create(tileInput());
  return tile;
};
