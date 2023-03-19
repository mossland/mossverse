import {
  defaultInitClientForm,
  Get,
  InitClientForm,
  createSlicer,
  SetGet,
  client,
  LoginForm,
  getGeolocation,
  Geolocation,
  pageMap,
  logger,
} from "@shared/util-client";
import Router, { NextRouter } from "next/router";
import type { RootState } from "../store";
import * as gql from "../gql";
import { Utils } from "@shared/util";

// * 1. State에 대한 내용을 정의하세요.
const state = {
  ...defaultInitClientForm,
  innerWidth: 0,
  innerHeight: 0,
  uiOperation: "sleep" as "sleep" | "loading" | "idle",
};

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  initClient: async ({ uri, ws, networkType = "debugnet", jwt, whoAmI }: InitClientForm) => {
    console.log(jwt);
    const { login, whereAmI } = get() as Get<typeof state, typeof actions>;
    set({ networkType, whoAmI });
    await client.init(uri, ws, { networkType, jwt });
    logger.debug(`Client initialized, jwt: ${client.jwt}`);
    if (client.jwt) await login({ auth: pageMap.getAuth(), loginType: "autoLogin" });
    // whereAmI();
    set({ uiOperation: "idle" });
  },
  whereAmI: async () => {
    let geolocation: Geolocation | undefined = undefined;
    while (!geolocation) {
      try {
        geolocation = await getGeolocation();
        break;
      } catch (e) {
        Utils.sleep(3000);
        console.log("Failed to get geolocation. Retrying...");
      }
    }
    if (!geolocation) return;
    if (Router.asPath.includes("skipBlocks=true") ?? localStorage.getItem("skipBlocks"))
      localStorage.setItem("skipBlocks", "true");
    else if (pageMap.blockCountries.includes(geolocation.countryCode)) {
      window.alert(`This site is not accessible in ${geolocation.countryName}.`);
      window.close();
    }
    client.setGeolocation(geolocation);
  },
  login: async ({ auth, loginType, jwt }: LoginForm) => {
    const { whoAmI, initAdminAuth, initUserAuth } = get() as RootState;
    if (jwt) client.setJwt(jwt);
    try {
      // 1. Auth Process
      if (auth === "admin") await initAdminAuth();
      else {
        await initUserAuth();
        await whoAmI();
      }
      // 2. Redirect
      pageMap.redirectAfterLogin(loginType, auth);
    } catch (err) {
      logger.debug(`Login failed: ${err}`);
      if (auth !== "public") pageMap.unauthorize();
      await client.reset();
    }
  },
  logout: () => {
    const { whoAmI } = get() as RootState;
    client.reset();
    whoAmI({ reset: true });
    set({ me: gql.defaultAdmin as gql.Admin, myKeyring: gql.defaultKeyring } as any);
    Router.push(pageMap.public.home);
  },
  goto(path: string) {
    Router.push(path);
  },
  checkAuth: () => {
    const { uiOperation, me, myKeyring } = get() as RootState;
    if (uiOperation !== "idle") return;
    const auth = pageMap.getAuth();
    logger.debug(`Current Page's required auth: ${auth}`);
    if (auth === "admin" && !me.id?.length) pageMap.unauthorize();
    else if (auth === "user" && !myKeyring.id?.length) pageMap.unauthorize();
  },
});

export type UiState = Get<typeof state, typeof actions>;

// * 3. ChildSlice를 추가하세요. Suffix 규칙은 일반적으로 "InModel" as const 로 작성합니다.
export const addUiToStore = ({ set, get, pick }: SetGet<UiState>) => ({
  ...state,
  ...actions({ set, get, pick }),
});
