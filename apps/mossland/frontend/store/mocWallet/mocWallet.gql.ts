import * as types from "../types";
import gql from "graphql-tag";
import { cnst } from "@shared/util";
import { query, mutate, receiptFragment } from "@platform/data-access";

// * MocWallet Query
export type MocWalletQuery = { mocWallet: types.MocWallet };
export const mocWalletQuery = gql`
  ${types.mocWalletFragment}
  query mocWallet($mocWalletId: ID!) {
    mocWallets(mocWalletId: $mocWalletId) {
      ...mocWalletFragment
    }
  }
`;

export const mocWallet = async (mocWalletId: string) =>
  (await query<MocWalletQuery>(mocWalletsQuery, { mocWalletId })).mocWallet;

// * MocWallets Query
export type MocWalletsQuery = { mocWallets: types.MocWallet[] };
export const mocWalletsQuery = gql`
  ${types.mocWalletFragment}
  query mocWallets($query: JSON!, $skip: Int, $limit: Int) {
    mocWallets(query: $query, skip: $skip, limit: $limit) {
      ...mocWalletFragment
    }
  }
`;
export const mocWallets = async (qry: any, skip = 0, limit = 0) =>
  (await query<MocWalletsQuery>(mocWalletsQuery, { query: qry, skip, limit })).mocWallets;

// * Create MocWallet Mutation
export type CreateMocWalletMutation = { createMocWallet: types.MocWallet };
export const createMocWalletMutation = gql`
  ${types.mocWalletFragment}
  mutation createMocWallet($data: MocWalletInput!) {
    createMocWallet(data: $data) {
      ...mocWalletFragment
    }
  }
`;
export const createMocWallet = async (data: types.MocWalletInput) =>
  (await mutate<CreateMocWalletMutation>(createMocWalletMutation, { data })).createMocWallet;

// * Update MocWallet Mutation
export type UpdateMocWalletMutation = { updateMocWallet: types.MocWallet };
export const updateMocWalletMutation = gql`
  ${types.mocWalletFragment}
  mutation updateMocWallet($mocWalletId: ID!, $data: MocWalletInput!) {
    updateMocWallet(mocWalletId: $mocWalletId, data: $data) {
      ...mocWalletFragment
    }
  }
`;
export const updateMocWallet = async (mocWalletId: string, data: types.MocWalletInput) =>
  (await mutate<UpdateMocWalletMutation>(updateMocWalletMutation, { mocWalletId, data })).updateMocWallet;

// * Remove MocWallet Mutation
export type RemoveMocWalletMutation = { removeMocWallet: types.MocWallet };
export const removeMocWalletMutation = gql`
  ${types.mocWalletFragment}
  mutation removeMocWalletMutation($mocWalletId: ID!) {
    removeMocWallet(mocWalletId: $mocWalletId) {
      ...mocWalletFragment
    }
  }
`;

export const removeMocWallet = async (mocWalletId: string) =>
  (await mutate<RemoveMocWalletMutation>(removeMocWalletMutation, { mocWalletId })).removeMocWallet;

// * GetActiveMocWallet Mutation
export type GetActiveMocWalletQuery = { getActiveMocWallet: types.MocWallet };
export const getActiveMocWalletQuery = gql`
  ${types.mocWalletFragment}
  query getActiveMocWalletQuery {
    getActiveMocWallet {
      ...mocWalletFragment
    }
  }
`;

export const getActiveMocWallet = async () =>
  (await query<GetActiveMocWalletQuery>(getActiveMocWalletQuery, {})).getActiveMocWallet;

// * Deposit Mutation
export type DepositMutation = { deposit: types.MocWallet };
export const depositMutation = gql`
  ${types.mocWalletFragment}
  mutation deposit($userId: ID!) {
    deposit(userId: $userId) {
      ...mocWalletFragment
    }
  }
`;

export const deposit = async (userId: string) => (await mutate<DepositMutation>(depositMutation, { userId })).deposit;

// * Withdraw Mutation
export type WithdrawMutation = { withdraw: types.lib.Receipt };
export const withdrawMutation = gql`
  ${receiptFragment}
  mutation withdraw($userId: ID!, $address: String!, $amount: Float!) {
    withdraw(userId: $userId, address: $address, amount: $amount) {
      ...receiptFragment
    }
  }
`;

export const withdraw = async (userId: string, address: string, amount: number) =>
  (await mutate<WithdrawMutation>(withdrawMutation, { userId, address, amount })).withdraw;
