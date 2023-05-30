import * as cnst from "../cnst";
import * as emp from "../emp";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { UserEmployee } from "../user/user.employee";
import { cnst as shared } from "@shared/server";

@Resolver(() => cnst.Staking)
export class StakingResolver {
  constructor(
    private readonly userEmployee: UserEmployee,
    private readonly walletEmployee: emp.shared.WalletEmployee
  ) {}

  @ResolveField(() => shared.User)
  async user(@Parent() staking: cnst.Staking) {
    return await this.userEmployee.load(staking.user);
  }
  @ResolveField(() => shared.Wallet)
  async wallet(@Parent() staking: cnst.Staking) {
    return await this.walletEmployee.load(staking.wallet);
  }
}
