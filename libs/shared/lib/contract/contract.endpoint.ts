import * as cnst from "../cnst";
import { Allow, BaseResolver, Id } from "@util/server";
import { Args, ID, Int, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ContractEmployee } from "./contract.employee";
import { NetworkEmployee } from "../network/network.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.Contract)
export class ContractResolver extends BaseResolver(
  cnst.Contract,
  cnst.ContractInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(private readonly contractEmployee: ContractEmployee, private readonly networkEmployee: NetworkEmployee) {
    super(contractEmployee);
  }
  @UseGuards(Allow.Every)
  @Mutation(() => cnst.Contract)
  async generateContract(
    @Args({ type: () => cnst.ContractInput, name: "data" })
    data: cnst.ContractInput,
    @Args({ type: () => [Int], name: "ids", nullable: true }) ids?: number[]
  ) {
    return await this.contractEmployee.generateContract(data, ids);
  }

  @UseGuards(Allow.Admin)
  @Mutation(() => [cnst.Ownership])
  async snapshotContract(@Args({ type: () => ID, name: "contractId" }) contractId: string) {
    return await this.contractEmployee.snapshot(new Id(contractId));
  }

  @ResolveField(() => cnst.Network)
  async network(@Parent() contract: cnst.Contract) {
    return await this.networkEmployee.load(contract.network);
  }
}
