import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  createFragment,
  Field,
  InputType,
  mutate,
  query,
  ObjectType,
  Int,
  BaseGql,
} from "@shared/util-client";

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

export const networkGraphQL = createGraphQL<"network", Network, NetworkInput>(Network, NetworkInput);
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
  defaultNetwork,
} = networkGraphQL;
