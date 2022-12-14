import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { TestingModule } from "@nestjs/testing";
import { registerModules } from "../modules";
import { TestSystem } from "@shared/test-server";
import { UserService } from "./user.service";
describe("User Service", () => {
  const system = new TestSystem();
  let userService: UserService;
  let keyring: db.shared.Keyring.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules);
    userService = app.get<UserService>(UserService);
    keyring = await sample.shared.createKeyring(app);
  });
  afterAll(async () => await system.terminate());
  let user: db.User.Doc;
  let input: gql.UserInput;
  it("Create User", async () => {
    user = await userService.whoAmI(keyring._id);
    expect(user.status).toEqual("active");
    expect(user.items).toBeDefined();
  });
  it("Update User", async () => {
    input = sample.userInput();
    user = await userService.update(user._id, input);
    expect(user.nickname).toEqual(input.nickname);
  });
  it("Remove User", async () => {
    user = await userService.remove(user._id);
    expect(user.status).toEqual("inactive");
  });
});
