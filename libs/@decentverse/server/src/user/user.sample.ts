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
  hotkeys: [],
});
export const createUser = async (app: TestingModule, keyringId: Id) => {
  const userService = app.get<srv.UserService>(srv.UserService);
  const user = await userService.whoAmI(keyringId);
  return await user.merge(userInput()).save();
};
