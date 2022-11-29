import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Admin from "./admin.model";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { LoadService } from "@shared/util-server";
import { SecurityOptions } from "../option";

@Injectable()
export class AdminService extends LoadService<Admin.Mdl, Admin.Doc, Admin.Input> {
  constructor(
    @Inject("SECURITY_OPTIONS") private readonly options: SecurityOptions,
    @InjectModel(Admin.name) private readonly Admin: Admin.Mdl
  ) {
    super(AdminService.name, Admin);
  }
  async signinAdmin(accountId: string, password: string) {
    const account = await this.Admin.findOne({ accountId }).select({
      status: true,
      role: true,
      password: true,
    });
    if (!account) throw new Error("No Account");
    if (account.status !== "active" || !(await bcrypt.compare(password, account.password || "")))
      throw new Error(`not match`);
    const token = jwt.sign({ _id: account._id, role: account.role, status: account.status }, this.options.jwtSecret);
    return { accessToken: token };
  }
}
