import { environment } from "../_environments/environment";
import { AdminService } from "./admin.service";
import { adminInput } from "@shared/module/sample";
import * as db from "../db";
import * as gql from "../gql";
import { registerModules } from "../module";
import { TestSystem } from "@shared/test-server";
import { Utils } from "@shared/util";

describe("Admin Service", () => {
  const system = new TestSystem();
  let adminService: AdminService;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    adminService = app.get<AdminService>(AdminService);
  });
  afterAll(async () => await system.terminate());
  let admin: db.Admin.Doc;
  let input: gql.AdminInput;
  it("Create Admin", async () => {
    input = adminInput();
    admin = await adminService.create(input);
    expect(admin.status).toEqual("active");
    expect(admin).toEqual(expect.objectContaining({ accountId: input.accountId, email: input.email }));
  });
  it("Update Admin", async () => {
    input = adminInput();
    admin = await adminService.update(admin._id, input);
    expect(admin).toEqual(expect.objectContaining({ accountId: input.accountId, email: input.email }));
  });
  it("Remove Admin", async () => {
    admin = await adminService.remove(admin._id);
    expect(admin.status).toEqual("inactive");
  });
});
