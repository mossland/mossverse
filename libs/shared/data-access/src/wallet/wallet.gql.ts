import { query, mutate } from "../apollo";
import gql from "graphql-tag";
import * as types from "../types";

// * Wallet Query
export type WalletQuery = { wallet: types.Wallet };
export const walletQuery = gql`
  ${types.walletFragment}
  query wallet($walletId: ID!) {
    wallet(walletId: $walletId) {
      ...walletFragment
    }
  }
`;
export const wallet = async (walletId: string) => (await query<WalletQuery>(walletQuery, { walletId })).wallet;

// * Wallets Query
export type WalletsQuery = { wallets: types.Wallet[]; walletCount: number };
export const walletsQuery = gql`
  ${types.walletFragment}
  query wallets($query: JSON!, $skip: Int, $limit: Int) {
    wallets(query: $query, skip: $skip, limit: $limit) {
      ...walletFragment
    }
    walletCount(query: $query)
  }
`;
export const wallets = async (qry: any, skip = 0, limit = 0) =>
  (await query<WalletsQuery>(walletsQuery, { query: qry, skip, limit })).wallets;
