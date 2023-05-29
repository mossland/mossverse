import { TestSystem } from "@shared/test-server";
import { environment } from "../env/environment";

import * as cnst from "../cnst";
import * as db from "../db";
import * as sample from "../sample";
import { UserEmployee } from "./user.employee";
import { registerModules } from "../server";

describe("User Service", () => {
  const system = new TestSystem();
  let userEmployee: UserEmployee;
  let network: db.shared.Network.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    userEmployee = app.get<UserEmployee>(UserEmployee);
    network = await sample.shared.createNetwork(app, "klaytn");
  });
  afterAll(async () => await system.terminate());
  let user: db.User.Doc;
  let input: cnst.UserInput;
  it("Create User", async () => {
    [user] = await sample.createUser(system.app, network._id, environment.klaytn.testWallets[0].address);
    expect(user.status).toEqual("active");
  });
  it("Update User", async () => {
    input = sample.userInput();
    user = await userEmployee.update(user._id, input);
    expect(user).toEqual(expect.objectContaining(input));
  });
  it("Remove User", async () => {
    user = await userEmployee.remove(user._id, {});
    expect(user.status).toEqual("inactive");
  });
});
