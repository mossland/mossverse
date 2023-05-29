import * as Role from "./role.document";
import * as cnst from "../cnst";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";

@Injectable()
export class RoleEmployee extends LoadService<Role.Mdl, Role.Doc, Role.Input> {
  constructor(@InjectModel(Role.name) private readonly Role: Role.Mdl) {
    super(RoleEmployee.name, Role);
  }
  async summarize(): Promise<cnst.RoleSummary> {
    return {
      totalRole: await this.Role.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
