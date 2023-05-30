import * as db from "../db";
import * as cnst from "../cnst";
import * as sample from "../sample";
import { RoleEmployee } from "./role.employee";
import { TestSystem } from "@shared/test-server";
import { environment } from "../env/environment";
import { registerModules } from "../server";

describe("Role Service", () => {
  const system = new TestSystem();
  let roleEmployee: RoleEmployee;
  let file: db.shared.File.Doc;
  let map: db.Map.Doc;
  let user: db.User.Doc;
  let keyring: db.shared.Keyring.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    roleEmployee = app.get<RoleEmployee>(RoleEmployee);
    file = await sample.shared.createFile(app);
    map = await sample.createMap(app, file._id);
    keyring = await sample.shared.createKeyring(app);
    user = await sample.createUser(app, keyring._id);
  });
  afterAll(async () => await system.terminate());
  let role: db.Role.Doc;
  let input: cnst.RoleInput;
  it("Create Role", async () => {
    input = sample.roleInput(map._id);
    role = await roleEmployee.create(input);
    expect(role.status).toEqual("active");
    expect(role.name).toEqual(input.name);
  });
  it("Update Role", async () => {
    input = sample.roleInput(map._id);
    role = await roleEmployee.update(role._id, input);
    expect(role.name).toEqual(input.name);
  });
  // it("Apply Role to User", async () => {});
  // it("Edit Map with Role", async () => {});
  // it("Unable to edit map without Role", async () => {});
  it("Remove Role", async () => {
    role = await roleEmployee.remove(role._id);
    expect(role.status).toEqual("inactive");
  });
});
