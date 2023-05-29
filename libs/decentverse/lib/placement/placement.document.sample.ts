import * as cnst from "../cnst";
import * as emp from "../emp";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const placementInput = (): cnst.PlacementInput => ({} as any);

export const createPlacement = async (app: TestingModule) => {
  const placementEmployee = app.get<emp.PlacementEmployee>(emp.PlacementEmployee);
  const placement = await placementEmployee.create(placementInput());
  return placement;
};
