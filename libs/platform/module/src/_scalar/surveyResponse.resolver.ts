import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import * as gql from "../gql";
import * as srv from "../srv";
@Resolver(() => gql.SurveyResponse)
export class SurveyResponseResolver {
  constructor(
    private readonly walletService: srv.shared.WalletService,
    private readonly tokenService: srv.shared.TokenService
  ) {}

  @ResolveField(() => gql.shared.Wallet)
  async wallet(@Parent() response: gql.SurveyResponse) {
    return await this.walletService.load(response.wallet);
  }

  @ResolveField(() => gql.shared.Wallet)
  async items(@Parent() response: gql.SurveyResponse) {
    return await this.tokenService.loadMany(response.tokens);
  }
}
