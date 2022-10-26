import { TestSystem } from "@shared/test-server";

import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import * as sample from "../sample";
import { registerModules } from "../modules";
import { UserService } from "./user.service";

describe("User Service", () => {
  const system = new TestSystem();
  let userService: UserService;
  beforeAll(async () => {
    const app = await system.init(registerModules);
    userService = app.get<UserService>(UserService);
  });
  afterAll(async () => await system.terminate());
  let user: db.User.Doc;
  let input: gql.UserInput;
  it("Create User", async () => {
    input = sample.userInput();
    user = await userService.create(input);
    expect(user.status).toEqual("active");
    expect(user).toEqual(expect.objectContaining(input));
  });
  it("Update User", async () => {
    input = sample.userInput();
    user = await userService.update(user._id, input);
    expect(user).toEqual(expect.objectContaining(input));
  });
  it("Remove User", async () => {
    user = await userService.remove(user._id);
    expect(user.status).toEqual("inactive");
  });
});
