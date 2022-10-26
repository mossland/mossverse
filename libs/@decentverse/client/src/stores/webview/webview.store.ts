/* eslint-disable @typescript-eslint/no-var-requires */
import axios from "axios";
import create, { SetState, GetState } from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { createSelectors, Nullable } from "@shared/util-client";

type State = Nullable<types.Webview> & {
  webviewOpen: boolean;
  webview: types.Webview | null;
  operation: "idle" | "loading";
};

const initialState: State = {
  ...types.defaultWebview,
  webviewOpen: false,
  webview: null,
  operation: "idle",
};

type Action = {
  get: () => types.Webview;
};
export const useWebview = create<State & Action>((set, get) => ({
  ...initialState,
  get: () => {
    const { url, message, errorMessage, isEmbed, purpose } = get();
    return {
      // 임시 기능
      id: "",
      center: [0, 0],
      wh: [0, 0],
      size: [500, 500],
      url: url ?? "",
      message: message ?? "",
      errorMessage: errorMessage ?? "",
      isEmbed: isEmbed ?? true,
      purpose: purpose ?? "default",
    };
  },
}));

export const webviewStore = createSelectors(useWebview);
