import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../gql";
import * as srv from "../srv";
import { WalletService } from "../wallet/wallet.service";
import { TokenService } from "../token/token.service";
@Resolver(() => gql.Ownership)
export class OwnershipResolver {
  constructor(private readonly tokenService: TokenService, private readonly walletService: WalletService) {}

  @ResolveField(() => gql.Token, { nullable: true })
  async token(@Parent() ownership: gql.Ownership) {
    return await this.tokenService.load(ownership.token);
  }
  @ResolveField(() => gql.Wallet)
  async wallet(@Parent() ownership: gql.Ownership) {
    return await this.walletService.load(ownership.wallet);
  }
}
