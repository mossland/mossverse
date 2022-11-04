import create from "zustand";
import * as gql from "../gql";
import {
  createActions,
  createState,
  DefaultActions,
  DefaultState,
  generateStore,
  setLink,
  setToken,
} from "@shared/util-client";
import Router, { NextRouter } from "next/router";
import { cnst } from "@shared/util";
import { getRequiredAuth } from "./ui.util";
import { admin, keyring } from "../store";

type State = {
  router: NextRouter | null;
  pageMap: cnst.PageMap;
  entryPath: string;
  uri: string;
  ws: string | null;
  token: string | null;
  networkType: cnst.NetworkType;
  uiOperation: "sleep" | "loading" | "idle";
};
const initialState: State = {
  router: null,
  pageMap: cnst.defaultPageMap,
  entryPath: "/",
  uri: "http://localhost:8080/graphql",
  ws: null,
  token: null,
  networkType: "ganache",
  uiOperation: "sleep",
};
type Actions = {
  initUi: (router: NextRouter, pageMap: cnst.PageMap) => void;
  initGql: (uri: string, ws: string | null, networkType: cnst.NetworkType) => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => void;
  goto(path: string): void;
  checkAuth: () => void;
};
const store = create<State & Actions>((set, get) => ({
  ...initialState,
  initUi: (router: NextRouter, pageMap: cnst.PageMap) => {
    set({ router, pageMap, entryPath: router.pathname });
  },
  initGql: async (uri: string, ws: string | null, networkType: cnst.NetworkType = "ganache") => {
    const token = localStorage.getItem("currentUser");
    setLink(uri);
    if (token) setToken(token);
    return new Promise((resolve) => {
      setTimeout(async () => {
        if (token) await get().login(token);
        else get().checkAuth();
        set({ uri, ws, token, networkType, uiOperation: "idle" });
        resolve();
      }, 100);
    });
  },
  login: async (token: string) => {
    setToken(token);
    const { router, pageMap, entryPath } = get();
    if (!router) return;
    const requiredAuth = getRequiredAuth(pageMap, router.pathname);
    try {
      if (requiredAuth === "user") await keyring.getState().initAuth();
      else if (requiredAuth === "admin") await admin.getState().initAuth();
      localStorage.setItem("currentUser", token);
      const entryAuth = getRequiredAuth(pageMap, entryPath);
      router.push(entryAuth === "public" ? pageMap[requiredAuth].home : entryPath);
    } catch (err) {
      localStorage.removeItem("currentUser");
    }
  },
  logout: () => {
    localStorage.removeItem("currentUser");
  },
  goto(path: string) {
    const { router, pageMap } = get();
    if (!router) return;
    const requiredAuth = getRequiredAuth(pageMap, router.pathname);
    if (path === "home") router.push(pageMap[requiredAuth].home);
    else if (path === "unauthorized") router.push(pageMap[requiredAuth].unauthorized);
    else router.push(path);
  },
  checkAuth: () => {
    const { router, pageMap, goto } = get();
    if (!router) return;
    const requiredAuth = getRequiredAuth(pageMap, router.pathname);
    if (requiredAuth === "admin" && !admin.getState().me) router.push(pageMap[requiredAuth].unauthorized);
    else if (requiredAuth === "user" && !keyring.getState().me) router.push(pageMap[requiredAuth].unauthorized);
  },
}));
export const ui = generateStore(store);
