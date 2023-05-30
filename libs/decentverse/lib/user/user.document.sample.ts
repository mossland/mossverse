import * as cnst from "../cnst";
import * as emp from "../emp";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const userInput = (): cnst.UserInput => ({
  nickname: c.word(),
  currentPosition: [10, 10],
  requestRoles: [],
});
export const createUser = async (app: TestingModule, keyringId: Id) => {
  const keyringEmployee = app.get<emp.shared.KeyringEmployee>(emp.shared.KeyringEmployee);
  const user = await keyringEmployee.whoAmI(keyringId);
  return await user.merge(userInput()).save();
};
