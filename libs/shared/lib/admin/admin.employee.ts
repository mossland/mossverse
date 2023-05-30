import * as Admin from "./admin.document";
import * as cnstt from "../cnst";
import * as jwt from "jsonwebtoken";
import { Id, LoadService, cnst } from "@util/server";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import bcrypt from "bcryptjs";
import type { SecurityOptions } from "../option";

@Injectable()
export class AdminEmployee extends LoadService<Admin.Mdl, Admin.Doc, Admin.Input> {
  constructor(
    @Inject("SECURITY_OPTIONS") private readonly options: SecurityOptions,
    @InjectModel(Admin.name) private readonly Admin: Admin.Mdl
  ) {
    super(AdminEmployee.name, Admin);
  }
  async signinAdmin(accountId: string, password: string) {
    const account = await this.Admin.findOne({ accountId }).select({
      status: true,
      roles: true,
      password: true,
    });
    if (!account) throw new Error("No Account");
    if (account.status !== "active" || !(await bcrypt.compare(password, account.password || "")))
      throw new Error(`not match`);
    const token = jwt.sign(
      {
        _id: account._id,
        role: "admin",
        roles: account.roles,
        status: account.status,
      },
      this.options.jwtSecret
    );
    return { jwt: token };
  }
  async addRole(adminId: Id, role: cnst.AdminRole) {
    const admin = await this.Admin.pickById(adminId);
    return await admin.addRole(role).save();
  }
  async subRole(adminId: Id, role: cnst.AdminRole) {
    const admin = await this.Admin.pickById(adminId);
    return await admin.subRole(role).save();
  }
  async summarize(): Promise<cnstt.AdminSummary> {
    return {
      totalAdmin: await this.Admin.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
