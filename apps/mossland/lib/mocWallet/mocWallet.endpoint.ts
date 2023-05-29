import * as cnst from "../cnst";
import * as emp from "../emp";
import { Account, Allow, Auth, BaseResolver, Id } from "@util/server";
import { Args, Float, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { MocWalletEmployee } from "./mocWallet.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.MocWallet)
export class MocWalletResolver extends BaseResolver(
  cnst.MocWallet,
  cnst.MocWalletInput,
  Allow.Public,
  Allow.Public,
  Allow.Public
) {
  constructor(private readonly mocWalletEmployee: MocWalletEmployee, private readonly userEmployee: emp.UserEmployee) {
    super(mocWalletEmployee);
  }

  @Mutation(() => cnst.MocWallet)
  @UseGuards(Allow.User)
  async deposit(@Args({ name: "userId", type: () => ID }) userId: Id, @Auth() account: Account) {
    return await this.mocWalletEmployee.deposit(new Id(userId));
  }

  @Mutation(() => cnst.platform.Receipt)
  @UseGuards(Allow.User)
  async withdraw(
    @Args({ name: "userId", type: () => ID }) userId: Id,
    @Args({ name: "address", type: () => String }) address: string,
    @Args({ name: "amount", type: () => Float }) amount: number,
    @Auth() account: Account
  ) {
    return await this.mocWalletEmployee.withdraw(new Id(userId), address, amount);
  }

  @ResolveField(() => cnst.shared.User)
  async user(@Parent() mocWallet: cnst.MocWallet) {
    return await this.userEmployee.load(mocWallet.user);
  }
}
