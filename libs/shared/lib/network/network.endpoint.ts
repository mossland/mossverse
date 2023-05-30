import * as cnst from "../cnst";
import { Allow, BaseResolver } from "@util/server";
import { NetworkEmployee } from "./network.employee";
import { Resolver } from "@nestjs/graphql";

@Resolver(() => cnst.Network)
export class NetworkResolver extends BaseResolver(
  cnst.Network,
  cnst.NetworkInput,
  Allow.Public,
  Allow.Public,
  Allow.SuperAdmin
) {
  constructor(private readonly networkEmployee: NetworkEmployee) {
    super(networkEmployee);
  }
}
