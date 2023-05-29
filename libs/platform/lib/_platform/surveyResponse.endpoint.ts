import * as cnst from "../cnst";
import * as emp from "../emp";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
@Resolver(() => cnst.SurveyResponse)
export class SurveyResponseResolver {
  constructor(
    private readonly walletEmployee: emp.shared.WalletEmployee,
    private readonly tokenEmployee: emp.shared.TokenEmployee
  ) {}

  @ResolveField(() => cnst.shared.Wallet)
  async wallet(@Parent() response: cnst.SurveyResponse) {
    return await this.walletEmployee.load(response.wallet);
  }

  @ResolveField(() => cnst.shared.Wallet)
  async items(@Parent() response: cnst.SurveyResponse) {
    return await this.tokenEmployee.loadMany(response.tokens);
  }
}
