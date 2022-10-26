import { query, mutate } from "../apollo";
import gql from "graphql-tag";
import * as types from "../types";

export type CreateNetworkMutation = { createNetwork: types.Network };
export const createNetworkMutation = gql`
  ${types.networkFragment}
  mutation createNetwork($data: NetworkInput!) {
    createNetwork(data: $data) {
      ...networkFragment
    }
  }
`;

export const createNetwork = async (data: types.NetworkInput) =>
  (await mutate<CreateNetworkMutation>(createNetworkMutation, { data })).createNetwork;

export type NetworkQuery = { network: types.Network };
export const networkQuery = gql`
  ${types.networkFragment}
  query network($networkId: ID!) {
    network(networkId: $networkId) {
      ...networkFragment
    }
  }
`;

export type UpdateNetworkMutation = { updateNetwork: types.Network };
export const updateNetworkMutation = gql`
  ${types.networkFragment}
  mutation updateNetwork($networkId: ID!, $data: NetworkInput!) {
    updateNetwork(networkId: $networkId, data: $data) {
      ...networkFragment
    }
  }
`;
export const updateNetwork = async (networkId: string, data: types.NetworkInput) =>
  (await mutate<UpdateNetworkMutation>(updateNetworkMutation, { networkId, data })).updateNetwork;

export const network = async (networkId: string) => (await query<NetworkQuery>(networkQuery, { networkId })).network;

export type NetworksQuery = { networks: types.Network[] };
export const networksQuery = gql`
  ${types.networkFragment}
  query networks($query: JSON!, $limit: Int, $skip: Int) {
    networks(limit: $limit, query: $query, skip: $skip) {
      ...networkFragment
    }
  }
`;

export const networks = async (qry: any, skip = 0, limit = 0) =>
  (await query<NetworksQuery>(networksQuery, { query: qry, skip, limit })).networks;
