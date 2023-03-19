import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { AdminService } from "./admin.service";
import { Allow, Account, BaseResolver, Auth, Id, RequiredAuth } from "@shared/util-server";
import * as gql from "../gql";
import { UseGuards } from "@nestjs/common";
import { cnst } from "@shared/util";

@Resolver(() => gql.Admin)
export class AdminResolver extends BaseResolver(gql.Admin, gql.AdminInput, Allow.Admin, Allow.Admin, Allow.SuperAdmin) {
  constructor(private readonly adminService: AdminService) {
    super(adminService);
  }
  @Query(() => gql.Admin)
  @UseGuards(Allow.Admin)
  async me(@Auth() account: Account) {
    return this.adminService.get(new Id(account._id));
  }
  @Mutation(() => gql.AccessToken)
  async signinAdmin(
    @Args({ name: "accountId", type: () => String }) accountId: string,
    @Args({ name: "password", type: () => String }) password: string
  ) {
    return await this.adminService.signinAdmin(accountId, password);
  }
  @Mutation(() => gql.Admin)
  @UseGuards(Allow.Admin)
  async addAdminRole(
    @Args({ name: "adminId", type: () => ID }) adminId: string,
    @Args({ name: "role", type: () => String }) role: cnst.AdminRole,
    @RequiredAuth() account: Account
  ) {
    const level = cnst.adminRoles.findIndex((r) => r === role);
    if (account.roles.every((adminRole) => cnst.adminRoles.findIndex((r) => r === adminRole) < level))
      throw new Error("Not Allowed");
    return await this.adminService.addRole(new Id(adminId), role);
  }
  @Mutation(() => gql.Admin)
  @UseGuards(Allow.Admin)
  async subAdminRole(
    @Args({ name: "adminId", type: () => ID }) adminId: string,
    @Args({ name: "role", type: () => String }) role: cnst.AdminRole,
    @RequiredAuth() account: Account
  ) {
    const level = cnst.adminRoles.findIndex((r) => r === role);
    if (account.roles.every((adminRole) => cnst.adminRoles.findIndex((r) => r === adminRole) < level))
      throw new Error("Not Allowed");
    return await this.adminService.subRole(new Id(adminId), role);
  }
}
