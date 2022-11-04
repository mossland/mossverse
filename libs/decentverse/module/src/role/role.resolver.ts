import { Resolver, Query, Mutation, Args, ID, ResolveField } from "@nestjs/graphql";
import { RoleService } from "./role.service";
import { Allow, Account, BaseResolver, Id, ObjectId } from "@shared/util-server";
import { UseGuards } from "@nestjs/common";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
@Resolver(() => gql.Role)
export class RoleResolver extends BaseResolver(gql.Role, gql.RoleInput, Allow.Admin, Allow.SuperAdmin, Allow.Admin) {
  constructor(private readonly roleService: RoleService) {
    super(roleService);
  }
}
