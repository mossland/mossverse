import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import * as emp from "../emp";
import { TestSystem } from "@shared/test-server";
import { UserEmployee } from "./user.employee";
import { environment } from "../env/environment";
import { registerModules } from "../server";
describe("User Service", () => {
  const system = new TestSystem();
  let userEmployee: UserEmployee;
  let keyringEmployee: emp.shared.KeyringEmployee;
  let keyring: db.shared.Keyring.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    userEmployee = app.get<UserEmployee>(UserEmployee);
    keyringEmployee = app.get<emp.shared.KeyringEmployee>(emp.shared.KeyringEmployee);
    keyring = await sample.shared.createKeyring(app);
  });
  afterAll(async () => await system.terminate());
  let user: db.User.Doc;
  let input: cnst.UserInput;
  it("Create User", async () => {
    user = await keyringEmployee.whoAmI(keyring._id);
    expect(user.status).toEqual("active");
    expect(user.items).toBeDefined();
  });
  it("Update User", async () => {
    input = sample.userInput();
    user = await userEmployee.update(user._id, input);
    expect(user.nickname).toEqual(input.nickname);
  });
  it("Remove User", async () => {
    user = await userEmployee.remove(user._id);
    expect(user.status).toEqual("inactive");
  });
});
