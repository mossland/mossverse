/* eslint-disable @typescript-eslint/no-var-requires */
import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { createSelectors, Nullable } from "@shared/util-client";

type State = Nullable<types.Live> & {
  //
};

const initialState: State = {
  ...types.defaultLive,
};

type Action = {
  get: () => types.Live;
};
export const useLive = create<State & Action>((set, get) => ({
  ...initialState,
  get: () => ({
    // 임시 기능
    id: "",
    message: "message",
    errorMessage: "error",
    center: [0, 0],
    wh: [0, 0],
    src: get().src ?? "",
  }),
}));

export const liveStore = createSelectors(useLive);
