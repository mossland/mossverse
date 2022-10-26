import { query, mutate } from "../index";
import * as types from "../types";
import gql from "graphql-tag";
import { cnst } from "@shared/util";

// * Receipt Query
export type ReceiptQuery = { receipt: types.Receipt };
export const receiptQuery = gql`
  ${types.receiptFragment}
  query receipt($receiptId: ID!) {
    receipts(receiptId: $receiptId) {
      ...receiptFragment
    }
  }
`;

export const receipt = async (receiptId: string) => (await query<ReceiptQuery>(receiptsQuery, { receiptId })).receipt;

// * Receipts Query
export type ReceiptsQuery = { receipts: types.Receipt[] };
export const receiptsQuery = gql`
  ${types.receiptFragment}
  query receipts($query: JSON!, $skip: Int, $limit: Int) {
    receipts(query: $query, skip: $skip, limit: $limit) {
      ...receiptFragment
    }
  }
`;
export const receipts = async (qry: any, skip = 0, limit = 0) =>
  (await query<ReceiptsQuery>(receiptsQuery, { query: qry, skip, limit })).receipts;

// * Create Receipt Mutation
export type CreateReceiptMutation = { createReceipt: types.Receipt };
export const createReceiptMutation = gql`
  ${types.receiptFragment}
  mutation createReceipt($data: ReceiptInput!) {
    createReceipt(data: $data) {
      ...receiptFragment
    }
  }
`;
export const createReceipt = async (data: types.ReceiptInput) =>
  (await mutate<CreateReceiptMutation>(createReceiptMutation, { data })).createReceipt;

// * Update Receipt Mutation
export type UpdateReceiptMutation = { updateReceipt: types.Receipt };
export const updateReceiptMutation = gql`
  ${types.receiptFragment}
  mutation updateReceipt($receiptId: ID!, $data: ReceiptInput!) {
    updateReceipt(receiptId: $receiptId, data: $data) {
      ...receiptFragment
    }
  }
`;
export const updateReceipt = async (receiptId: string, data: types.ReceiptInput) =>
  (await mutate<UpdateReceiptMutation>(updateReceiptMutation, { receiptId, data })).updateReceipt;

// * Remove Receipt Mutation
export type RemoveReceiptMutation = { removeReceipt: types.Receipt };
export const removeReceiptMutation = gql`
  ${types.receiptFragment}
  mutation removeReceiptMutation($receiptId: ID!) {
    removeReceiptMutation(receiptId: $receiptId) {
      ...receiptFragment
    }
  }
`;

export const removeReceipt = async (receiptId: string) =>
  (await mutate<RemoveReceiptMutation>(removeReceiptMutation, { receiptId })).removeReceipt;

// * Open Receipt Mutation
export type OpenReceiptMutation = { openReceipt: types.Receipt };
export const openReceiptMutation = gql`
  ${types.receiptFragment}
  mutation openReceipt($receiptId: ID!, $data: ReceiptInput!) {
    openReceipt(receiptId: $receiptId, data: $data) {
      ...receiptFragment
    }
  }
`;

// * MyReceipts Query
export type MyReceiptsQuery = { myReceipts: types.Receipt[] };
export const myReceiptsQuery = gql`
  ${types.receiptFragment}
  query myReceipts($userId: ID!, $type: String!) {
    myReceipts(userId: $userId, type: $type) {
      ...receiptFragment
    }
  }
`;

export const myReceipts = async (userId: string, type: cnst.ReceiptType) =>
  (await query<MyReceiptsQuery>(myReceiptsQuery, { userId, type })).myReceipts;
