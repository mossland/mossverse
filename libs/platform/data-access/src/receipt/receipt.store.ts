import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { devtools } from "zustand/middleware";
import { createSelectors, Nullable } from "@shared/util-client";
import { update } from "libs/shared/util/src/utils";
import { cnst } from "@shared/util";

type State = Nullable<types.Receipt> & {
  receipt: types.Receipt | null;
  receipts: types.Receipt[];
  operation: cnst.StoreOperation;
};

const initialState: State = {
  ...types.defaultReceipt,
  receipt: null,
  receipts: [],
  operation: "sleep",
};

type Action = {
  init: (selfId: string) => Promise<void>; // 초기화
  // purify: () => types.ReceiptInput | null; // 유효성검사 및 Map => MapInput 변환
  // create: () => Promise<void>; // 생성
  // update: () => Promise<void>; // 수정
  // remove: (id: string) => Promise<void>; // 제거
  // reset: (receipt?: types.Receipt) => void; // 수정필드 리셋
  // buyItem: () => void;
};

export const useReceipt = create<State & Action>()(
  devtools((set, get) => ({
    ...initialState,
    init: async (selfId: string) => {
      const receipts = await gql.myReceipts(selfId, "trade");

      set({ receipts: receipts });
    },
  }))
);
// purify: () => {
//   const state = get();
//   //
// },

// create: async () => {
//   //
// }, // 생성
// update: async () => {
//   //
// }, // 수정
// remove: async () => {
//   //
// }, // 제거
// reset: (listing?: types.Listing) => {
//   //
// },

export const receiptStore = createSelectors(useReceipt);
