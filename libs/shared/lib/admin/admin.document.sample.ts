import * as cnst from "../cnst";
import { AdminEmployee } from "./admin.employee";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const adminInput = (): cnst.AdminInput => ({
  accountId: c.email(),
  password: c.word(),
});
export const createAdmin = async (app: TestingModule) => {
  const adminEmployee = app.get<AdminEmployee>(AdminEmployee);
  const admin = await adminEmployee.create(adminInput());
  return admin;
};
