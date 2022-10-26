import create from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "react-toastify";
import { Utils } from "@shared/util";
export interface ExchangeUiState {
  inputBefore: number;
  after: number;
  inputConfirm: string;
  updateInputBefore: (before: string, limit: number) => void;
  validationExchangeCheck: () => boolean;
  updateInputConfirm: (value: string) => void;
  copyAddressCallback: (copyText: string) => void;
}

export const useExchangeUi = create<ExchangeUiState>()(
  devtools((set, get) => ({
    exchangeMode: "MOCtoMMOC",
    inputBefore: 0,
    after: 0,
    inputConfirm: "",
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
