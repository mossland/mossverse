import create from "zustand";
import * as gql from "../gql";
import { setLink, createActions, createState, DefaultActions, DefaultState, generateStore } from "@shared/util-client";
import { adminGraphQL, Admin, AdminInput } from "./admin.gql";
import { subscribeWithSelector } from "zustand/middleware";
import { ui } from "../store";

type State = DefaultState<"admin", gql.Admin> & {
  me: gql.Admin | null;
  adminMenu: string;
  menuOpen: boolean;
  viewMode: "signin" | "signup" | "info";
};
const initialState: State = {
  ...createState<"admin", gql.Admin, gql.AdminInput>(adminGraphQL),
  me: null,
  adminMenu: "default",
  menuOpen: false,
  viewMode: "signin",
};
type Actions = DefaultActions<"admin", gql.Admin, gql.AdminInput> & {
  initAuth: () => Promise<void>; // 초기화
  signin: () => Promise<void>;
  signout: () => void;
};
const store = create(
  subscribeWithSelector<State & Actions>((set, get) => ({
    ...initialState,
    ...createActions<"admin", gql.Admin, gql.AdminInput>(adminGraphQL, { get, set }),
    initAuth: async () => {
      const me = await gql.me();
      set({ me, viewMode: "info", adminOperation: "idle" });
    },
    signin: async () => {
      try {
        const { accountId, password } = get();
        const token = (await gql.signinAdmin(accountId ?? "", password ?? "")).accessToken;
        await ui.getState().login(token);
      } catch (e) {
        throw new Error("Auth Failed");
      }
    },
    signout: () => {
      if (localStorage) localStorage.removeItem("currentUser");
      set({ me: null, viewMode: "signin" });
    },
  }))
);
export const admin = generateStore(store);
