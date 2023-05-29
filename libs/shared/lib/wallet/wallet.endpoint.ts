import * as cnst from "../cnst";
import { Allow, BaseResolver } from "@util/server";
import { NetworkEmployee } from "../network/network.employee";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { WalletEmployee } from "./wallet.employee";
@Resolver(() => cnst.Wallet)
export class WalletResolver extends BaseResolver(cnst.Wallet, cnst.WalletInput, Allow.None, Allow.None, Allow.None) {
  constructor(private readonly walletEmployee: WalletEmployee, private readonly networkEmployee: NetworkEmployee) {
    super(walletEmployee);
  }

  @ResolveField(() => cnst.Network)
  async network(@Parent() wallet: cnst.Wallet) {
    return await this.networkEmployee.load(wallet.network);
  }
}
