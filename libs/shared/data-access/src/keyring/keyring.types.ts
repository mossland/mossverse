import gql from "graphql-tag";
import * as types from "../types";
import { cnst } from "@shared/util";
import { walletFragment } from "../wallet/wallet.types";
import { contractFragment } from "../contract/contract.types";
import WalletConnect from "@walletconnect/client";

export type Keyring = {
  id: string;
  prevUser?: string;
  wallets: types.Wallet[];
  holds: types.Contract[];
  discord?: Record<string, any>;
  status: cnst.KeyringStatus;
  createdAt: Date;
  updatedAt: Date;
};

export const keyringFragment = gql`
  ${walletFragment}
  ${contractFragment}
  fragment keyringFragment on Keyring {
    id
    prevUser
    wallets {
      ...walletFragment
    }
    holds {
      ...contractFragment
    }
    discord
    status
    createdAt
    updatedAt
  }
`;

export type WalletConnectType = {
  connector: WalletConnect;
  accounts: string[];
  chainId: number;
};
export type LoginMethod = cnst.NetworkProvider | "walletConnect" | "guest" | "none";
export type MetamaskProvider = "ethereum";
