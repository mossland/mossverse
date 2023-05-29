import * as cnst from "../cnst";
import { Allow, BaseResolver } from "@util/server";
import { Resolver } from "@nestjs/graphql";
import { RoleEmployee } from "./role.employee";
@Resolver(() => cnst.Role)
export class RoleResolver extends BaseResolver(cnst.Role, cnst.RoleInput, Allow.Admin, Allow.SuperAdmin, Allow.Admin) {
  constructor(private readonly roleEmployee: RoleEmployee) {
    super(roleEmployee);
  }
}
