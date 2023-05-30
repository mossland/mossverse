import * as cnst from "../cnst";
import * as emp from "../emp";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const teleportInput = (): cnst.TeleportInput => ({} as any);

export const createTeleport = async (app: TestingModule) => {
  const teleportEmployee = app.get<emp.TeleportEmployee>(emp.TeleportEmployee);
  const teleport = await teleportEmployee.create(teleportInput());
  return teleport;
};
