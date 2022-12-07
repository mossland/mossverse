import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, makeStore, SetGet } from "@shared/util-client";
import { mocWalletGraphQL, MocWallet, MocWalletInput } from "./mocWallet.gql";

const state = {
  ...createState(mocWalletGraphQL),
  depositAddress: "0x",
  depositAmount: 0,
  understand: false,
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(mocWalletGraphQL, { get, set }),
  deposit: async (selfId: string) => {
    // const { mocWallet } = get();
    // if (!mocWallet) return;
    const newMocWallet = await gql.deposit(selfId);
    set({ mocWallet: newMocWallet });
  },
  withdraw: async (selfId: string, address: string, amount: number) => {
    await gql.withdraw(selfId, address, amount);
    return; //! void만 리턴 가능
  },
});
export const mocWallet = makeStore(mocWalletGraphQL.refName, state, actions);
