import * as cnst from "../cnst";
import { Account, Allow, Auth, Id, Signature } from "@util/server";
import { Args, ID, Mutation, Resolver } from "@nestjs/graphql";
import { SkinManagerEmployee } from "./skinManager.employee";
import { UseGuards } from "@nestjs/common";

@Resolver()
export class SkinManagerResolver {
  constructor(private readonly skinManagerEmployee: SkinManagerEmployee) {}

  @Mutation(() => cnst.platform.Trade)
  @UseGuards(Allow.User)
  async tradeSkin(
    @Args({ name: "characterId", type: () => ID }) characterId: string,
    @Args({ name: "data", type: () => cnst.platform.TradeInput })
    data: cnst.platform.TradeInput,
    @Auth() account: Account,
    @Signature() address: string
  ) {
    return await this.skinManagerEmployee.tradeSkin(new Id(characterId), data, new Id(account.keyring), address);
  }
}
