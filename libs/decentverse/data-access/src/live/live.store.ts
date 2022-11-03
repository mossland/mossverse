/* eslint-disable @typescript-eslint/no-var-requires */
import create from "zustand";
import * as gql from "../gql";
import { DefaultOf, generateStore, Nullable } from "@shared/util-client";

type State = DefaultOf<gql.Live> & {
  //
};

const initialState: State = {
  ...gql.defaultLive,
};

type Action = {
  get: () => gql.Live;
};
const store = create<State & Action>((set, get) => ({
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

export const live = generateStore(store);
