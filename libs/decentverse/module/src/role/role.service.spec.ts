import { environment } from "../_environments/environment";
import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
import { RoleService } from "./role.service";
import { TestSystem } from "@shared/test-server";
import { RoleModule } from "./role.module";

describe("Role Service", () => {
  const system = new TestSystem();
  let roleService: RoleService;
  let file: db.shared.File.Doc;
  let map: db.Map.Doc;
  let user: db.User.Doc;
  let keyring: db.shared.Keyring.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    roleService = app.get<RoleService>(RoleService);
    file = await sample.shared.createFile(app);
    map = await sample.createMap(app, file._id);
    keyring = await sample.shared.createKeyring(app);
    user = await sample.createUser(app, keyring._id);
  });
  afterAll(async () => await system.terminate());
  let role: db.Role.Doc;
  let input: gql.RoleInput;
  it("Create Role", async () => {
    input = sample.roleInput(map._id);
    role = await roleService.create(input);
    expect(role.status).toEqual("active");
    expect(role.name).toEqual(input.name);
  });
  it("Update Role", async () => {
    input = sample.roleInput(map._id);
    role = await roleService.update(role._id, input);
    expect(role.name).toEqual(input.name);
  });
  // it("Apply Role to User", async () => {});
  // it("Edit Map with Role", async () => {});
  // it("Unable to edit map without Role", async () => {});
  it("Remove Role", async () => {
    role = await roleService.remove(role._id);
    expect(role.status).toEqual("inactive");
  });
});
