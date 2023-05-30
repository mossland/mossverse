import { BaseGql, Field, InputType, Int, ObjectType, PickType, cnst, createGraphQL } from "@util/client";

@InputType("NetworkInput")
export class NetworkInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  endPoint: string;

  @Field(() => String)
  type: cnst.NetworkType;

  @Field(() => String)
  provider: cnst.NetworkProvider;

  @Field(() => Int)
  networkId: number;
}

@ObjectType("Network", { _id: "id" })
export class Network extends BaseGql(NetworkInput) {
  @Field(() => String)
  status: cnst.NetworkStatus;
}

@ObjectType("LightNetwork", { _id: "id", gqlRef: "Network" })
export class LightNetwork extends PickType(Network, ["name", "networkId", "provider", "type", "status"] as const) {}

@ObjectType("NetworkSummary")
export class NetworkSummary {
  @Field(() => Int)
  totalNetwork: number;
}

export const networkQueryMap = {
  totalNetwork: { status: { $ne: "inactive" } },
};

export const networkGraphQL = createGraphQL("network" as const, Network, NetworkInput, LightNetwork);
export const {
  getNetwork,
  listNetwork,
  networkCount,
  networkExists,
  createNetwork,
  updateNetwork,
  removeNetwork,
  networkFragment,
  purifyNetwork,
  crystalizeNetwork,
  lightCrystalizeNetwork,
  defaultNetwork,
  mergeNetwork,
} = networkGraphQL;
