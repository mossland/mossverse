import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { Allow, Account, BaseResolver, Id } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import { NetworkService } from "../network/network.service";
import { forwardRef, Inject } from "@nestjs/common";
@Resolver(() => gql.Wallet)
export class WalletResolver extends BaseResolver(gql.Wallet, gql.WalletInput, Allow.None, Allow.None, Allow.None) {
  constructor(private readonly walletService: WalletService, private readonly networkService: NetworkService) {
    super(walletService);
  }

  @ResolveField(() => gql.Network)
  async network(@Parent() wallet: gql.Wallet) {
    return await this.networkService.load(wallet.network);
  }
}
