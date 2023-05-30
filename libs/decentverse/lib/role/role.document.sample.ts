import * as cnst from "../cnst";
import * as emp from "../emp";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const roleInput = (map: Id): cnst.RoleInput => ({
  name: c.word(),
  areas: [{ map, center: [100, 100], wh: [100, 100] }],
});
export const createRole = async (app: TestingModule, mapId: Id) => {
  const roleEmployee = app.get<emp.RoleEmployee>(emp.RoleEmployee);
  const role = await roleEmployee.create(roleInput(mapId));
  return role;
};
