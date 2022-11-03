import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { AdminService } from "./admin.service";
import { Allow, Account, BaseResolver, Auth, Id, UserIp } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { UseGuards } from "@nestjs/common";

@Resolver(() => gql.Admin)
export class AdminResolver extends BaseResolver(gql.Admin, gql.AdminInput, Allow.Admin, Allow.Admin, Allow.SuperAdmin) {
  constructor(private readonly adminService: AdminService) {
    super(adminService);
  }
  @Query(() => String)
  @UseGuards(Allow.Every)
  ping() {
    return "ping";
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
}
