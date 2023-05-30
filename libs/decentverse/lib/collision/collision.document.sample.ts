import * as cnst from "../cnst";
import * as emp from "../emp";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const collisionInput = (): cnst.CollisionInput => ({} as any);

export const createCollision = async (app: TestingModule) => {
  const collisionEmployee = app.get<emp.CollisionEmployee>(emp.CollisionEmployee);
  const collision = await collisionEmployee.create(collisionInput());
  return collision;
};
