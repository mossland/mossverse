import { query, mutate } from "../gql";
import gql from "graphql-tag";
import * as types from "./dialog.types";

// * Dialog Query
export type DialogQuery = { dialog: types.Dialog };
export const dialogQuery = gql`
  ${types.dialogFragment}
  query dialog($dialogId: ID!) {
    dialog(dialogId: $dialogId) {
      ...dialogFragment
    }
  }
`;
export const dialog = async (dialogId: string) => (await query<DialogQuery>(dialogQuery, { dialogId })).dialog;

// * Dialogs Query
export type DialogsQuery = { dialogs: types.Dialog[] };
export const dialogsQuery = gql`
  ${types.dialogFragment}
  query dialogs($query: JSON!, $skip: Int, $limit: Int) {
    dialogs(query: $query, skip: $skip, limit: $limit) {
      status
      ...dialogFragment
    }
  }
`;
export const dialogs = async (qry: any, skip = 0, limit = 0) =>
  (await query<DialogsQuery>(dialogsQuery, { query: qry, skip, limit })).dialogs;

// * Create Dialog Mutation
export type CreateDialogMutation = { createDialog: types.Dialog };
export const createDialogMutation = gql`
  ${types.dialogFragment}
  mutation createDialog($data: DialogInput!) {
    createDialog(data: $data) {
      ...dialogFragment
    }
  }
`;
export const createDialog = async (data: types.DialogInput) =>
  (await mutate<CreateDialogMutation>(createDialogMutation, { data })).createDialog;

// * Update Dialog Mutation
export type UpdateDialogMutation = { updateDialog: types.Dialog };
export const updateDialogMutation = gql`
  ${types.dialogFragment}
  mutation updateDialog($dialogId: ID!, $data: DialogInput!) {
    updateDialog(dialogId: $dialogId, data: $data) {
      ...dialogFragment
    }
  }
`;
export const updateDialog = async (dialogId: string, data: types.DialogInput) =>
  (await mutate<UpdateDialogMutation>(updateDialogMutation, { dialogId, data })).updateDialog;

// * Remove Admin Mutation
export type RemoveDialogMutation = { removeDialog: types.Dialog };
export const removeDialogMutation = gql`
  ${types.dialogFragment}
  mutation removeDialog($dialogId: DialogInput!) {
    removeDialog(dialogId: $dialogId) {
      ...dialogFragment
    }
  }
`;
export const removeDialog = async (dialogId: string) =>
  (await mutate<RemoveDialogMutation>(removeDialogMutation, { dialogId })).removeDialog;
