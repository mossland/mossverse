import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { ContractService } from "./contract.service";
import { Allow, Account, BaseResolver, Id } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import { UseGuards } from "@nestjs/common";
import { NetworkService } from "../network/network.service";

@Resolver(() => gql.Contract)
export class ContractResolver extends BaseResolver(
  gql.Contract,
  gql.ContractInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(private readonly contractService: ContractService, private readonly networkService: NetworkService) {
    super(contractService);
  }
  @UseGuards(Allow.Every)
  @Mutation(() => gql.Contract)
  async generateContract(
    @Args({ type: () => gql.ContractInput, name: "data" }) data: gql.ContractInput,
    @Args({ type: () => [Int], name: "ids", nullable: true }) ids?: number[]
  ) {
    return await this.contractService.generateContract(data, ids);
  }

  @UseGuards(Allow.Admin)
  @Mutation(() => [gql.Ownership])
  async snapshotContract(@Args({ type: () => ID, name: "contractId" }) contractId: string) {
    return await this.contractService.snapshot(new Id(contractId));
  }

  @ResolveField(() => gql.Network)
  async network(@Parent() contract: gql.Contract) {
    return await this.networkService.load(contract.network);
  }
}
