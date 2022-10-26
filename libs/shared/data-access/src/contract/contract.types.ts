import gql from "graphql-tag";
import * as types from "../types";
import { cnst } from "@shared/util";
import { networkFragment } from "../network/network.types";
import { Nullable } from "@shared/util-client";
export type ContractInput = {
  network: string;
  address: string;
  displayName: string | null;
};
export type Contract = {
  id: string;
  network: types.Network;
  address: string;
  displayName: string | null;
  interface: cnst.ContractInterface;
  name: string;
  symbol: string;
  totalSupply: number;
  bn: number;
  snapshotAt: Date;
  status: cnst.ContractStatus;
  createdAt: Date;
  updatedAt: Date;
};
export const defaultContract: Nullable<Contract> = {
  id: null,
  network: null,
  address: null,
  displayName: null,
  interface: null,
  name: null,
  symbol: null,
  totalSupply: null,
  bn: null,
  snapshotAt: null,
  status: null,
  createdAt: null,
  updatedAt: null,
};
export const purifyContract = (contract: Contract): ContractInput => ({
  network: contract.network.id,
  address: contract.address,
  displayName: contract.displayName,
});

export const contractFragment = gql`
  ${networkFragment}
  fragment contractFragment on Contract {
    id
    network {
      ...networkFragment
    }
    address
    displayName
    interface
    name
    symbol
    totalSupply
    bn
    snapshotAt
    status
    createdAt
    updatedAt
  }
`;
