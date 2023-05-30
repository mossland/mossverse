import * as cnst from "../cnst";
import * as emp from "../emp";
import { AdvertiseEmployee } from "./advertise.employee";
import { Allow, BaseResolver } from "@util/server";
import { Resolver } from "@nestjs/graphql";

@Resolver(() => cnst.Advertise)
export class AdvertiseResolver extends BaseResolver(
  cnst.Advertise,
  cnst.AdvertiseInput,
  Allow.Public,
  Allow.Public,
  Allow.Public
) {
  constructor(
    private readonly AdvertiseEmployee: AdvertiseEmployee,
    private readonly userEmployee: emp.UserEmployee,
    private readonly walletEmployee: emp.shared.WalletEmployee,
    private readonly tokenEmployee: emp.shared.TokenEmployee,
    private readonly thingEmployee: emp.shared.ThingEmployee,
    private readonly productEmployee: emp.shared.ProductEmployee
  ) {
    super(AdvertiseEmployee);
  }
}
