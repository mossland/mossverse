import create from "zustand";
import { toast } from "react-toastify";
import * as gql from "../gql";
import { devtools } from "zustand/middleware";
import { Utils } from "@shared/util";
import { generateStore } from "@shared/util-client";
interface ExchangeState {
  inputBefore: number;
  after: number;
  inputConfirm: string;
  updateInputBefore: (before: string, limit: number) => void;
  validationExchangeCheck: () => boolean;
  updateInputConfirm: (value: string) => void;
  copyAddressCallback: (copyText: string) => void;
}

const store = create<ExchangeState>()(
  devtools((set, get) => ({
    exchangeMode: "MOCtoMMOC",
    inputBefore: 0,
    after: 0,
    inputConfirm: "",
    // withdraw:(userId:string, address:string, depositAmount) => {
    //   return gql.withdraw(userId, address, depositAmount);
    // },
    updateInputBefore: (before, limit) => {
      let beforeNumber = Number(before);
      if (isNaN(beforeNumber) || beforeNumber > limit) return;
      if (beforeNumber <= 0) beforeNumber = 0;

      const after = beforeNumber;
      set({ inputBefore: beforeNumber, after }, false, "useExchange/updateInputBefore");
    },
    validationExchangeCheck: () => {
      return get().inputBefore > 0 && get().inputConfirm === "exchange";
    },
    updateInputConfirm: (value) => {
      set({ inputConfirm: value }, false, "useExchange/updateInputConfirm");
    },
    copyAddressCallback: (copyText) => {
      toast.success(`copied! : ${Utils.centerEllipsis(copyText)}`);
    },
  }))
);
export const exchange = generateStore(store);
