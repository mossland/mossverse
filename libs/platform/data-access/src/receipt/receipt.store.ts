import create from "zustand";
import * as gql from "../gql";
import { devtools } from "zustand/middleware";
import { createState, generateStore, Nullable } from "@shared/util-client";
import { cnst } from "@shared/util";
import { receiptGraphQL } from "./receipt.gql";

type State = Nullable<gql.Receipt> & {
  receipt: gql.Receipt | null;
  receipts: gql.Receipt[];
};

const initialState: State = {
  ...createState<"receipt", gql.Receipt, gql.ReceiptInput>(receiptGraphQL),
  receipt: null,
  receipts: [],
  operation: "sleep",
};

type Action = {
  init: (selfId: string) => Promise<void>; // 초기화
  // purify: () => gql.ReceiptInput | null; // 유효성검사 및 Map => MapInput 변환
  // create: () => Promise<void>; // 생성
  // update: () => Promise<void>; // 수정
  // remove: (id: string) => Promise<void>; // 제거
  // reset: (receipt?: gql.Receipt) => void; // 수정필드 리셋
  // buyItem: () => void;
};

const store = create<State & Action>()(
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
// reset: (listing?: gql.Listing) => {
//   //
// },

export const receipt = generateStore(store);
