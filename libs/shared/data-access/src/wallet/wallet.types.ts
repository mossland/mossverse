import gql from "graphql-tag";
import * as types from "../types";
import { cnst } from "@shared/util";
import { networkFragment } from "../network/network.types";
import { tokenItemFragment } from "../token/token.types";
import { Nullable } from "@shared/util-client";
export type WalletInput = {
  network: string;
};
export type Wallet = {
  id: string;
  network: types.Network;
  address: string;
  type: cnst.WalletType;
  items: types.TokenItem[];
  status: cnst.WalletStatus;
  createdAt: Date;
  updatedAt: Date;
};
export type Address = {
  address: string;
  provider: cnst.NetworkProvider;
};
export const defaultWallet: Nullable<Wallet> = {
  id: null,
  network: null,
  address: null,
  type: "user",
  items: [],
  status: null,
  createdAt: null,
  updatedAt: null,
};
export const walletFragment = gql`
  ${networkFragment}
  ${tokenItemFragment}
  fragment walletFragment on Wallet {
    id
    network {
      ...networkFragment
    }
    items {
      ...tokenItemFragment
    }
    address
    type
    status
    createdAt
    updatedAt
  }
`;
