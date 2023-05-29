import * as cnst from "../cnst";
import { Allow } from "@util/server";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { SecurityEmployee } from "./security.employee";
import { UseGuards } from "@nestjs/common";
import { emp as external } from "@external/server";

@Resolver()
export class SecurityResolver {
  constructor(
    private readonly securityEmployee: SecurityEmployee,
    private readonly pubsubEmployee: external.PubsubEmployee
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
  @Subscription(() => cnst.AccessLog, {
    name: "ping",
    filter: (payload, variable, context) => {
      return true;
    },
  })
  subPing() {
    return this.pubsubEmployee.pubsub.asyncIterator("ping");
  }

  @Mutation(() => String)
  @UseGuards(Allow.Every)
  async encrypt(@Args({ name: "data", type: () => String }) data: string) {
    return this.securityEmployee.encrypt(data);
  }
}
