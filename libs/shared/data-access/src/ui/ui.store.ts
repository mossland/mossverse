import create, { StateCreator } from "zustand";
import * as gql from "../gql";
import {
  defaultInitClientForm,
  Get,
  InitClientForm,
  makeStore,
  PageMap,
  SetGet,
  client,
  LoginForm,
  getGeolocation,
} from "@shared/util-client";
import Router, { NextRouter } from "next/router";
import { cnst } from "@shared/util";
import { admin, keyring } from "../store";
import { message } from "antd";

const state = {
  router: Router as NextRouter | typeof Router,
  ...defaultInitClientForm,
  uiOperation: "sleep" as "sleep" | "loading" | "idle",
};
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  initClient: async (
    router: NextRouter | typeof Router,
    { pageMap, uri, ws, networkType, whoAmI, msg, noti }: InitClientForm
  ) => {
    pageMap.setEntry(router.pathname, router.query);
    const geolocation = await getGeolocation();
    if (router.asPath.includes("skipBlocks=true") ?? localStorage.getItem("skipBlocks"))
      localStorage.setItem("skipBlocks", "true");
    else if (pageMap.blockCountries.includes(geolocation.countryCode))
      return window.alert(`This site is not accessible in ${geolocation.countryName}.`);
    const { login, checkAuth } = get() as Get<typeof state, typeof actions>;
    set({ networkType, pageMap, whoAmI, msg, noti, geolocation });
    await client.init(uri, ws);
    if (networkType) client.setNetworkType(networkType);
    const auth = pageMap.getAuth(router.pathname);
    if (client.token) await login({ auth, type: "autoLogin" });
    else checkAuth();
    set({ uiOperation: "idle" });
  },
  login: async ({ auth, type, token }: LoginForm) => {
    if (token) await client.setToken(token);
    const { router, pageMap, whoAmI } = get();
    try {
      // 1. Auth Process
      if (auth === "public") return;
      else if (auth === "user") {
        await keyring.getState().initAuth();
        await whoAmI();
      } else if (auth === "admin") await admin.getState().initAuth();

      // 2. Redirect
      if (type === "signin") router.replace(pageMap.getHome(auth));
      else if (type === "signup") router.replace(pageMap.getHome(auth));
      else if (type === "autoLogin") router.replace(pageMap.entry, pageMap.entryQuery);
      else if (type === "requireAuth") router.replace(pageMap.entry, pageMap.entryQuery);
    } catch (err) {
      router.push(pageMap.getUnauthorized());
      await client.reset();
    }
  },
  logout: () => {
    const { router, pageMap } = get();
    client.reset();
    router.push(pageMap.public.home);
  },
  goto(path: string) {
    const { router, pageMap } = get();
    const requiredAuth = pageMap.getAuth(router.pathname);
    if (path === "home") router.push(pageMap[requiredAuth].home);
    else if (path === "unauthorized") router.push(pageMap[requiredAuth].unauthorized);
    else router.push(path);
  },
  checkAuth: () => {
    const { router, pageMap, goto } = get() as Get<typeof state, typeof actions>;
    pageMap.setEntry(router.pathname, router.query);
    const auth = pageMap.getAuth(router.pathname);
    if (auth === "admin" && !admin.getState().me?.id) router.push(pageMap.admin.unauthorized);
    else if (auth === "user" && !keyring.getState().me.id) router.push(pageMap.user.unauthorized);
  },
});
export const ui = makeStore("Ui", state, actions);
