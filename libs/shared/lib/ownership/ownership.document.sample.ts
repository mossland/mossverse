import * as cnst from "../cnst";
import { Id } from "@util/server";
import { OwnershipEmployee } from "./ownership.employee";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const ownershipInput = (userId: Id = new Id(), thingId: Id = new Id()): cnst.OwnershipInput => ({
  type: "thing",
  user: userId,
  thing: thingId,
  value: 1,
});

export const createOwnership = async (app: TestingModule, userId: Id, thingId: Id) => {
  const ownershipEmployee = app.get<OwnershipEmployee>(OwnershipEmployee);
  const ownership = await ownershipEmployee.create(ownershipInput(userId, thingId));
  return ownership;
};
