import { Resolver, Query, Mutation, Args, ID, Subscription } from "@nestjs/graphql";
import { SecurityService } from "./security.service";
import { Allow } from "@shared/util-server";
import { UseGuards } from "@nestjs/common";
import { srv as external } from "@external/module";
import * as gql from "../gql";

@Resolver()
export class SecurityResolver {
  constructor(
    private readonly securityService: SecurityService,
    private readonly pubsubService: external.PubsubService
  ) {}

  @Query(() => String)
  @UseGuards(Allow.Public)
  ping() {
    return "ping";
  }

  @Query(() => String)
  @UseGuards(Allow.Every)
  pingEvery() {
    return "pingEvery";
  }

  @Query(() => String)
  @UseGuards(Allow.User)
  pingUser() {
    return "pingUser";
  }

  @Query(() => String)
  @UseGuards(Allow.Admin)
  pingAdmin() {
    return "pingAdmin";
  }

  // @UseGuards(Allow.Admin)
  @Subscription(() => gql.AccessLog, {
    name: "ping",
    filter: (payload, variable, context) => {
      return true;
    },
  })
  subPing() {
    return this.pubsubService.pubsub.asyncIterator("ping");
  }

  @Mutation(() => String)
  @UseGuards(Allow.Every)
  async encrypt(@Args({ name: "data", type: () => String }) data: string) {
    return this.securityService.encrypt(data);
  }
}
