import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const adminInput = (): gql.AdminInput => ({
  accountId: c.word(),
  password: c.word(),
  email: c.email(),
});
export const createAdmin = async (app: TestingModule) => {
  const adminService = app.get<srv.AdminService>(srv.AdminService);
  const admin = await adminService.create(adminInput());
  return admin;
};
