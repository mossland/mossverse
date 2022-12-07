import { environment } from "../_environments/environment";
import { TestSystem } from "@shared/test-server";

import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import * as sample from "../sample";
import { registerModules } from "../module";
import { UserService } from "./user.service";

describe("User Service", () => {
  const system = new TestSystem();
  let userService: UserService;
  let network: db.shared.Network.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    userService = app.get<UserService>(UserService);
    network = await sample.shared.createNetwork(app, "klaytn");
  });
  afterAll(async () => await system.terminate());
  let user: db.User.Doc;
  let input: gql.UserInput;
  it("Create User", async () => {
    [user] = await sample.createUser(system.app, network._id, environment.klaytn.testWallets[0].address);
    expect(user.status).toEqual("active");
  });
  it("Update User", async () => {
    input = sample.userInput();
    user = await userService.update(user._id, input);
    expect(user).toEqual(expect.objectContaining(input));
  });
  it("Remove User", async () => {
    user = await userService.remove(user._id, {});
    expect(user.status).toEqual("inactive");
  });
});
