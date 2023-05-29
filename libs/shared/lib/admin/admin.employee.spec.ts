import * as cnst from "../cnst";
import * as db from "../db";
import { AdminEmployee } from "./admin.employee";
import { TestSystem } from "@shared/test-server";
import { adminInput } from "@shared/sample";
import { environment } from "../env/environment";
import { registerModules } from "../server";

describe("Admin Service", () => {
  const system = new TestSystem();
  let adminEmployee: AdminEmployee;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    adminEmployee = app.get<AdminEmployee>(AdminEmployee);
  });
  afterAll(async () => await system.terminate());
  let admin: db.Admin.Doc;
  let input: cnst.AdminInput;
  it("Create Admin", async () => {
    input = adminInput();
    admin = await adminEmployee.create(input);
    expect(admin.status).toEqual("active");
    expect(admin).toEqual(
      expect.objectContaining({
        accountId: input.accountId,
        email: input.email,
      })
    );
  });
  it("Update Admin", async () => {
    input = adminInput();
    admin = await adminEmployee.update(admin._id, input);
    expect(admin).toEqual(
      expect.objectContaining({
        accountId: input.accountId,
        email: input.email,
      })
    );
  });
  it("Remove Admin", async () => {
    admin = await adminEmployee.remove(admin._id);
    expect(admin.status).toEqual("inactive");
  });
});
