import create from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { mocWalletGraphQL, MocWallet, MocWalletInput } from "./mocWallet.gql";

type State = DefaultState<"mocWallet", gql.MocWallet> & {
  depositAddress: string;
  depositAmount: number;
  understand: boolean;
};
const initialState: State = {
  ...createState<"mocWallet", gql.MocWallet, gql.MocWalletInput>(mocWalletGraphQL),
  depositAddress: "0x",
  depositAmount: 0,
  understand: false,
};
type Actions = DefaultActions<"mocWallet", gql.MocWallet, gql.MocWalletInput> & {
  deposit: (selfId: string) => Promise<void>;
  withdraw: (selfId: string, address: string, amount: number) => Promise<gql.platform.Receipt>;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  ...createActions<"mocWallet", gql.MocWallet, gql.MocWalletInput>(mocWalletGraphQL, { get, set }),
  deposit: async (selfId: string) => {
    // const { mocWallet } = get();
    // if (!mocWallet) return;
    const newMocWallet = await gql.deposit(selfId);
    set({ mocWallet: newMocWallet });
  },
  withdraw: async (selfId: string, address: string, amount: number) => {
    return await gql.withdraw(selfId, address, amount);
  },
}));
export const mocWallet = generateStore(store);
