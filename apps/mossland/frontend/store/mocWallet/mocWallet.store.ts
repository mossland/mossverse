import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { devtools } from "zustand/middleware";
import { createSelectors, Nullable } from "@shared/util-client";
import { update } from "libs/shared/util/src/utils";
import { cnst } from "@shared/util";

type State = Nullable<types.MocWallet> & {
  depositAddress: string;
  depositAmount: number;
  mocWallet: types.MocWallet | null;
  mocWallets: types.MocWallet[];
  understand: boolean;
  operation: cnst.StoreOperation;
};

const initialState: State = {
  ...types.defaultMocWallet,
  depositAddress: "0x",
  depositAmount: 0,
  mocWallet: null,
  mocWallets: [],
  understand: false,
  operation: "sleep",
};

type Action = {
  init: (selfId: string) => Promise<void>; // 초기화
  create: () => Promise<void>; // 생성
  update: () => Promise<void>; // 수정
  remove: (id: string) => Promise<void>; // 제거
  reset: (receipt?: types.MocWallet) => void; // 수정필드 리셋
  deposit: (selfId: string) => Promise<void>;
  withdraw: (selfId: string, address: string, amount: number) => Promise<types.lib.Receipt>;
};

export const useMocWallet = create<State & Action>()(
  devtools((set, get) => ({
    ...initialState,
    init: async (selfId: string) => {
      //
    },

    create: async () => {
      //
    }, // 생성
    update: async () => {
      //
    }, // 수정
    remove: async () => {
      //
    }, // 제거
    reset: (mocWallet?: types.MocWallet) => {
      //
    },

    deposit: async (selfId: string) => {
      // const { mocWallet } = get();
      // if (!mocWallet) return;
      const newMocWallet = await gql.deposit(selfId);
      set({ mocWallet: newMocWallet });
    },

    withdraw: async (selfId: string, address: string, amount: number) => {
      return await gql.withdraw(selfId, address, amount);
    },
  }))
);
export const mocWalletStore = createSelectors(useMocWallet);
