import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { Allow, Account, BaseResolver, Id } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { forwardRef, Inject } from "@nestjs/common";
@Resolver(() => gql.Wallet)
export class WalletResolver extends BaseResolver(gql.Wallet, gql.WalletInput, Allow.None, Allow.None, Allow.None) {
  constructor(private readonly walletService: WalletService, private readonly networkService: srv.NetworkService) {
    super(walletService);
  }

  // @UseGuards(Allow.Every)
  // @Mutation(() => gql.Wallet)
  // async inventory(@Args({ type: () => ID, name: "walletId" }) walletId: string) {
  //   return await this.walletService.inventory(walletId);
  // }

  @ResolveField(() => gql.Network)
  async network(@Parent() wallet: gql.Wallet) {
    return await this.networkService.load(wallet.network);
  }
}
