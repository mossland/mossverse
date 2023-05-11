import { TestingModule } from "@nestjs/testing";
import { Id } from "@shared/util-server";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
import { sample as shared } from "@shared/module";
const c = new Chance();
export const userInput = (): gql.UserInput => ({
  nickname: c.word(),
  currentPosition: [10, 10],
  requestRoles: [],
});
export const createUser = async (app: TestingModule, keyringId: Id) => {
  const keyringService = app.get<srv.shared.KeyringService>(srv.shared.KeyringService);
  const user = await keyringService.whoAmI(keyringId);
  return await user.merge(userInput()).save();
};
