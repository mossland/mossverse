import gql from "graphql-tag";
import * as types from "../types";
import { cnst } from "@shared/util";
import { Nullable } from "@shared/util-client";

export type NetworkInput = {
  name: string;
  endPoint: string;
  type: cnst.NetworkType;
  provider: cnst.NetworkProvider;
  networkId: number;
};
export type Network = {
  id: string;
  name: string;
  endPoint: string;
  type: cnst.NetworkType;
  provider: cnst.NetworkProvider;
  networkId: number;
  status: cnst.NetworkStatus;
  createdAt: Date;
  updatedAt: Date;
};
export const defaultNetwork: Nullable<Network> = {
  id: null,
  name: null,
  endPoint: null,
  type: "testnet",
  provider: "ethereum",
  networkId: 0,
  status: null,
  createdAt: null,
  updatedAt: null,
};
export const purifyNetwork = (network: Network): NetworkInput => ({
  name: network.name,
  endPoint: network.endPoint,
  type: network.type,
  provider: network.provider,
  networkId: network.networkId,
});

export const networkFragment = gql`
  fragment networkFragment on Network {
    id
    name
    endPoint
    type
    provider
    networkId
    status
    createdAt
    updatedAt
  }
`;
