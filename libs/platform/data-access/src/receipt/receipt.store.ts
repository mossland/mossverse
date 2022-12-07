import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, makeStore, SetGet } from "@shared/util-client";
import { cnst } from "@shared/util";
import { receiptGraphQL } from "./receipt.gql";

const state = {
  ...createState(receiptGraphQL),
  receipts: [] as gql.Receipt[],
};

const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(receiptGraphQL, { get, set }),
  init: async (selfId: string) => {
    const receipts = await gql.myReceipts(selfId, "trade");
    set({ receipts: receipts });
  },
});
export const receipt = makeStore(receiptGraphQL.refName, state, actions);
