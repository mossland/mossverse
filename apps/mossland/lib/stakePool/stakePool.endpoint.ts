import * as cnst from "../cnst";
import * as emp from "../emp";
import { Allow, BaseResolver, Id } from "@util/server";
import { Args, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { StakePoolEmployee } from "./stakePool.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.StakePool)
export class StakePoolResolver extends BaseResolver(
  cnst.StakePool,
  cnst.StakePoolInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(
    private readonly stakePoolEmployee: StakePoolEmployee,
    private readonly fileEmployee: emp.shared.FileEmployee,
    private readonly userEmployee: emp.UserEmployee,
    private readonly mapEmployee: emp.decentverse.MapEmployee,
    private readonly walletEmployee: emp.shared.WalletEmployee,
    private readonly tokenEmployee: emp.shared.TokenEmployee,
    private readonly thingEmployee: emp.shared.ThingEmployee
  ) {
    super(stakePoolEmployee);
  }

  @Mutation(() => cnst.StakePool)
  @UseGuards(Allow.Every)
  async addStaking(
    @Args({ name: "stakePoolId", type: () => ID }) stakePoolId: Id,
    @Args({ name: "staking", type: () => cnst.StakingInput }) staking: cnst.StakingInput
  ) {
    return await this.stakePoolEmployee.addStaking(stakePoolId, staking);
  }

  @ResolveField(() => cnst.shared.Thing)
  async thing(@Parent() stakePool: cnst.StakePool) {
    if (!stakePool.thing) return null;
    return await this.thingEmployee.load(stakePool.thing);
  }
}
