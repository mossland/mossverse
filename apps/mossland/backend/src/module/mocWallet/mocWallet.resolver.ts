import { Resolver, Query, Mutation, Args, Int, ID, Float, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "./../gql";
import * as srv from "./../srv";
import { Allow, Account, BaseResolver, Id, Auth, Signature } from "@shared/util-server";
import { Inject, UseGuards } from "@nestjs/common";
import { MocWalletService } from "./mocWallet.service";

@Resolver(() => gql.MocWallet)
export class MocWalletResolver extends BaseResolver(
  gql.MocWallet,
  gql.MocWalletInput,
  Allow.Public,
  Allow.Public,
  Allow.Public
) {
  constructor(private readonly mocWalletService: MocWalletService, private readonly userService: srv.UserService) {
    super(mocWalletService);
  }

  @Mutation(() => gql.MocWallet)
  @UseGuards(Allow.User)
  async deposit(@Args({ name: "userId", type: () => ID }) userId: Id, @Auth() account: Account) {
    return await this.mocWalletService.deposit(new Id(userId));
  }

  @Mutation(() => gql.platform.Receipt)
  @UseGuards(Allow.User)
  async withdraw(
    @Args({ name: "userId", type: () => ID }) userId: Id,
    @Args({ name: "address", type: () => String }) address: string,
    @Args({ name: "amount", type: () => Float }) amount: number,
    @Auth() account: Account
  ) {
    return await this.mocWalletService.withdraw(new Id(userId), address, amount);
  }

  @ResolveField(() => gql.shared.User)
  async user(@Parent() mocWallet: gql.MocWallet) {
    return await this.userService.load(mocWallet.user);
  }
}
