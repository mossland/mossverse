import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const roleInput = (map: Id): gql.RoleInput => ({
  name: c.word(),
  areas: [{ map, center: [100, 100], wh: [100, 100] }],
});
export const createRole = async (app: TestingModule, mapId: Id) => {
  const roleService = app.get<srv.RoleService>(srv.RoleService);
  const role = await roleService.create(roleInput(mapId));
  return role;
};
