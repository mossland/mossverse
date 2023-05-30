import * as cnst from "../cnst";
import * as emp from "../emp";
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
// import { WalletEmployee } from "@platform";
@Resolver(() => cnst.MocOwnership)
export class MocOwnershipResolver {
  constructor(
    private readonly thingEmployee: emp.shared.TokenEmployee,
    private readonly userEmployee: emp.UserEmployee
  ) {}
  @Query(() => cnst.MocOwnership)
  async tempMocOwnershipQuery() {
    return null;
  }
  @ResolveField(() => cnst.shared.Thing)
  async thing(@Parent() ownership: cnst.MocOwnership) {
    return await this.thingEmployee.load(ownership.user);
  }
  @ResolveField(() => cnst.shared.User)
  async user(@Parent() ownership: cnst.MocOwnership) {
    return await this.userEmployee.load(ownership.user);
  }
}
