import * as cnst from "../cnst";
import * as emp from "../emp";
import { Account, Allow, Auth, BaseResolver, Id, Signature } from "@util/server";
import { Args, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { RaffleEmployee } from "./raffle.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.Raffle)
export class RaffleResolver extends BaseResolver(cnst.Raffle, cnst.RaffleInput, Allow.Every, Allow.Every, Allow.Every) {
  constructor(
    private readonly raffleEmployee: RaffleEmployee,
    private readonly fileEmployee: emp.shared.FileEmployee,
    private readonly userEmployee: emp.UserEmployee,
    private readonly walletEmployee: emp.shared.WalletEmployee,
    private readonly tokenEmployee: emp.shared.TokenEmployee,
    private readonly thingEmployee: emp.shared.ThingEmployee,
    private readonly productEmployee: emp.shared.ProductEmployee
  ) {
    super(raffleEmployee);
  }

  @Mutation(() => cnst.Receipt)
  @UseGuards(Allow.User)
  async raffle(
    @Args({ name: "raffleId", type: () => ID }) raffleId: Id,
    @Args({ name: "priceTag", type: () => cnst.PriceTagInput })
    priceTag: cnst.PriceTagInput,
    @Auth() account: Account,
    @Signature() address: string
  ) {
    return await this.raffleEmployee.raffle(new Id(raffleId), priceTag, new Id(account.keyring), address);
  }

  @Mutation(() => cnst.ShipInfo)
  @UseGuards(Allow.User)
  async addWinnerShipInfo(
    @Args({ name: "raffleId", type: () => ID }) raffleId: Id,
    @Args({ name: "shipInfo", type: () => cnst.ShipInfoInput })
    shipInfo: cnst.ShipInfoInput,
    @Auth() account: Account,
    @Signature() address: string
  ) {
    return await this.raffleEmployee.addWinnerShipInfo(new Id(raffleId), shipInfo, new Id(account.keyring), address);
  }

  @ResolveField(() => [cnst.shared.User])
  async user(@Parent() raffle: cnst.Raffle) {
    if (!raffle.winners) return null;
    return await this.userEmployee.loadMany(raffle.winners);
  }
  @ResolveField(() => [cnst.shared.User])
  async winners(@Parent() raffle: cnst.Raffle) {
    if (!raffle.winners) return null;
    return await this.userEmployee.loadMany(raffle.winners);
  }
  @ResolveField(() => cnst.shared.Token)
  async token(@Parent() raffle: cnst.Raffle) {
    if (!raffle.token) return null;
    return await this.tokenEmployee.load(raffle.token);
  }

  @ResolveField(() => cnst.shared.Thing)
  async thing(@Parent() raffle: cnst.Raffle) {
    if (!raffle.thing) return null;
    return await this.thingEmployee.load(raffle.thing);
  }

  @ResolveField(() => cnst.shared.Product)
  async product(@Parent() raffle: cnst.Raffle) {
    if (!raffle.product) return null;
    return await this.productEmployee.load(raffle.product);
  }
}
