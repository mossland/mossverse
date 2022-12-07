import { Query, Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { UserService } from "../user/user.service";
import * as gql from "../gql";
import * as srv from "../srv";
// import { WalletService } from "@platform";
@Resolver(() => gql.MocOwnership)
export class MocOwnershipResolver {
  constructor(private readonly thingService: srv.shared.TokenService, private readonly userService: srv.UserService) {}
  @Query(() => gql.MocOwnership)
  async tempMocOwnershipQuery() {
    return null;
  }
  @ResolveField(() => gql.shared.Thing)
  async thing(@Parent() ownership: gql.MocOwnership) {
    return await this.thingService.load(ownership.user);
  }
  @ResolveField(() => gql.shared.User)
  async user(@Parent() ownership: gql.MocOwnership) {
    return await this.userService.load(ownership.user);
  }
}
