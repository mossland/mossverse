import * as cnstt from "../cnst";
import { Account, Allow, Auth, BaseResolver, Id, RequiredAuth, cnst } from "@util/server";
import { AdminEmployee } from "./admin.employee";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnstt.Admin)
export class AdminResolver extends BaseResolver(
  cnstt.Admin,
  cnstt.AdminInput,
  Allow.Public,
  Allow.Admin,
  Allow.SuperAdmin
) {
  constructor(private readonly adminEmployee: AdminEmployee) {
    super(adminEmployee);
  }
  @Query(() => cnstt.Admin)
  @UseGuards(Allow.Admin)
  async me(@Auth() account: Account) {
    return this.adminEmployee.get(new Id(account._id));
  }
  @Mutation(() => cnstt.AccessToken)
  async signinAdmin(
    @Args({ name: "accountId", type: () => String }) accountId: string,
    @Args({ name: "password", type: () => String }) password: string
  ) {
    return await this.adminEmployee.signinAdmin(accountId, password);
  }
  @Mutation(() => cnstt.Admin)
  @UseGuards(Allow.Admin)
  async addAdminRole(
    @Args({ name: "adminId", type: () => ID }) adminId: string,
    @Args({ name: "role", type: () => String }) role: cnst.AdminRole,
    @RequiredAuth() account: Account
  ) {
    const level = cnst.adminRoles.findIndex((r) => r === role);
    if (account.roles.every((adminRole) => cnst.adminRoles.findIndex((r) => r === adminRole) < level))
      throw new Error("Not Allowed");
    return await this.adminEmployee.addRole(new Id(adminId), role);
  }
  @Mutation(() => cnstt.Admin)
  @UseGuards(Allow.Admin)
  async subAdminRole(
    @Args({ name: "adminId", type: () => ID }) adminId: string,
    @Args({ name: "role", type: () => String }) role: cnst.AdminRole,
    @RequiredAuth() account: Account
  ) {
    const level = cnst.adminRoles.findIndex((r) => r === role);
    if (account.roles.every((adminRole) => cnst.adminRoles.findIndex((r) => r === adminRole) < level))
      throw new Error("Not Allowed");
    return await this.adminEmployee.subRole(new Id(adminId), role);
  }
}
