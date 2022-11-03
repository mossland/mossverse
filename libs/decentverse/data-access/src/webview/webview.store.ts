/* eslint-disable @typescript-eslint/no-var-requires */
import axios from "axios";
import create, { SetState, GetState } from "zustand";
import * as gql from "../gql";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { generateStore, Nullable } from "@shared/util-client";

type State = Nullable<gql.Webview> & {
  webviewOpen: boolean;
  webview: gql.Webview | null;
  operation: "idle" | "loading";
};

const initialState: State = {
  ...gql.defaultWebview,
  webviewOpen: false,
  webview: null,
  operation: "idle",
};

type Action = {
  get: () => gql.Webview;
};
const store = create<State & Action>((set, get) => ({
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

export const webview = generateStore(store);
