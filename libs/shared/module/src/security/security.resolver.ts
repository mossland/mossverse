import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { SecurityService } from "./security.service";
import { Allow } from "@shared/util-server";

import { UseGuards } from "@nestjs/common";

@Resolver()
export class SecurityResolver {
  constructor(private readonly securityService: SecurityService) {}

  @Mutation(() => String)
  @UseGuards(Allow.Every)
  async encrypt(@Args({ name: "data", type: () => String }) data: string) {
    return this.securityService.encrypt(data);
  }
}
