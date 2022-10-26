import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { devtools } from "zustand/middleware";
export interface ExchangeState {
  mocToMmoc: () => void;
  mmocToMoc: () => void;
}

export const useExchange = create<ExchangeState>()(
  devtools((set, get) => ({
    mocToMmoc: () => {
      console.log("mocToMmoc");
    },
    mmocToMoc: () => {
      console.log("mmocToMoc");
    },
  }))
);
