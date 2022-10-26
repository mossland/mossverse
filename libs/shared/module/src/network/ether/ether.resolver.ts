import { Resolver, Query, Mutation, Args, ID, Int } from "@nestjs/graphql";

import { UseGuards } from "@nestjs/common";
import { EtherService } from "./ether.service";

@Resolver()
export class EtherResolver {
  constructor(private readonly EtherService: EtherService) {}
  @Query(() => Int)
  async ether() {
    return 1;
  }
}
