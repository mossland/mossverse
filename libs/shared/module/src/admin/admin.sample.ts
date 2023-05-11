import { TestingModule } from "@nestjs/testing";
import { AdminService } from "./admin.service";
import * as Chance from "chance";
import * as gql from "../gql";
const c = new Chance();
export const adminInput = (): gql.AdminInput => ({
  accountId: c.email(),
  password: c.word(),
});
export const createAdmin = async (app: TestingModule) => {
  const adminService = app.get<AdminService>(AdminService);
  const admin = await adminService.create(adminInput());
  return admin;
};
