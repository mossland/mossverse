import * as cnst from "../cnst";
import * as emp from "../emp";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const liveInput = (): cnst.LiveInput => ({} as any);

export const createLive = async (app: TestingModule) => {
  const liveEmployee = app.get<emp.LiveEmployee>(emp.LiveEmployee);
  const live = await liveEmployee.create(liveInput());
  return live;
};
