import * as fetch from "../fetch";
import {
  Geolocation,
  Get,
  LoginForm,
  SetGet,
  Utils,
  client,
  cnst,
  defaultInitClientForm,
  getGeolocation,
  logger,
} from "@util/client";
import type { RootState } from "../store";

// * 1. State에 대한 내용을 정의하세요.
const state = {
  ...defaultInitClientForm,
  innerWidth: 0,
  innerHeight: 0,
  responsive: "md" as cnst.Responsive,
  uiOperation: "sleep" as "sleep" | "loading" | "idle",
  messages: [] as (typeof defaultMessage)[],
};

const defaultMessage = {
  type: "info" as "info" | "success" | "error" | "warning" | "loading",
  content: "",
  duration: 3, // seconds
  key: Utils.randomString(10),
};

// * 2. Action을 내용을 정의하세요. Action은 모두 void 함수여야 합니다.
// * 다른 action을 참조 시 get() as <Model>State 또는 RootState 를 사용하세요.
const actions = ({ set, get, pick }: SetGet<typeof state>) => ({
  // initClient: async ({ uri, ws, networkType = "debugnet", jwt, whoAmI }: InitClientForm) => {
  //   const { login, whereAmI } = get() as Get<typeof state, typeof actions>;
  //   set({ networkType, whoAmI });
  //   await client.init({ uri, ws, networkType, jwt });
  //   logger.debug(`Client initialized, jwt: ${client.jwt}`);
  //   //! if (client.jwt) await login({ auth: pageMap.getAuth(), loginType: "autoLogin" });
  //   // whereAmI();
  //   set({ uiOperation: "idle" });
  // },
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
    // if (!geolocation) return;
    // if (Router.asPath.includes("skipBlocks=true") ?? localStorage.getItem("skipBlocks"))
    //   localStorage.setItem("skipBlocks", "true");
    // else if (pageMap.blockCountries.includes(geolocation.countryCode)) {
    //   window.alert(`This site is not accessible in ${geolocation.countryName}.`);
    //   window.close();
    // }
    client.setGeolocation(geolocation);
  },
  login: async ({ auth, redirect, unauthorize, jwt }: LoginForm) => {
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
      if (redirect) client.router.push(redirect);
    } catch (err) {
      logger.debug(`Login failed: ${err}`);
      // ! if (auth !== "public") pageMap.unauthorize();
      client.reset();
      if (unauthorize) client.router.push(unauthorize);
    }
  },
  logout: () => {
    const { whoAmI } = get() as RootState;
    client.reset();
    set({
      me: fetch.defaultAdmin as fetch.Admin,
      myKeyring: fetch.defaultKeyring,
    } as any);
    whoAmI({ reset: true });
    // client.router.push(pageMap.public.home);
  },
  setWindowSize: () => {
    if (!window) return;
    const responsive = cnst.responsives[cnst.responsiveWidths.findIndex((w) => w < window.innerWidth)];
    set({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      responsive,
    });
  },
  showMessage: (message: { content: string | string[] } & Partial<typeof defaultMessage>) => {
    if (!message.key) message.key = Utils.randomString(10);
    const { messages } = get() as RootState;
    const newMessage = { ...defaultMessage, ...message };
    messages.some((m) => m.key === newMessage.key)
      ? set({ messages: messages.map((m) => (m.key === newMessage.key ? newMessage : m)) })
      : set({ messages: [...messages, newMessage] });
  },
  hideMessage: (key: string) => {
    const { messages } = get() as RootState;
    set({ messages: messages.filter((m) => m.key !== key) });
  },
});

export type UiState = Get<typeof state, typeof actions>;

// * 3. ChildSlice를 추가하세요. Suffix 규칙은 일반적으로 "InModel" as const 로 작성합니다.
export const makeUiSlice = ({ set, get, pick }: SetGet<UiState>) => ({
  ...state,
  ...actions({ set, get, pick }),
});
