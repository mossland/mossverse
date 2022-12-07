import { StateCreator } from "zustand";
import * as gql from "../gql";
import { createActions, createState, DefaultActions, DefaultState, makeStore, SetGet } from "@shared/util-client";
import { adminGraphQL, Admin, AdminInput, defaultAdmin } from "./admin.gql";
import { ui } from "../store";

const state = {
  ...createState(adminGraphQL),
  me: defaultAdmin as Admin,
  adminMenu: "default",
  menuOpen: false,
  viewMode: "signin" as "signin" | "signup" | "info",
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  ...createActions(adminGraphQL, { get, set }),
  initAuth: async () => {
    const me = await gql.me();
    set({ me, viewMode: "info", adminOperation: "idle" });
  },
  signin: async () => {
    try {
      const { accountId, password } = get().adminForm;
      const token = (await gql.signinAdmin(accountId ?? "", password ?? "")).accessToken;
      await ui.getState().login({ auth: "admin", token, type: "signin" });
    } catch (e) {
      throw new Error("Auth Failed");
    }
  },
  signout: () => {
    if (localStorage) localStorage.removeItem("currentUser");
    set({ me: defaultAdmin, viewMode: "signin", adminForm: adminGraphQL.defaultAdmin });
  },
});
export const admin = makeStore(adminGraphQL.refName, state, actions);
