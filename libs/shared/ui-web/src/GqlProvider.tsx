import { client, InitClientForm, logger, pageMap, PageMap, useInterval, WalletNetworkType } from "@shared/util-client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { gql, st } from "@shared/data-access";
import { cnst } from "@shared/util";
import { themeChange } from "theme-change";
import Router, { useRouter } from "next/router";
import { useCookies } from "react-cookie";
type GqlProviderProps = {
  pageMap: Partial<PageMap>;
  uri: string;
  ws: string | null;
  networkType?: WalletNetworkType;
  environment: string;
  init?: () => Promise<void>;
  userInit?: (self: { id: string }, me: gql.Keyring) => Promise<void>;
  children: ReactNode | ReactNode[];
  useSelf: () => { id: string } | null;
  whoAmI: (option?: { reset?: boolean }) => Promise<void>;
};

export const GqlProvider = ({
  children,
  useSelf,
  init,
  environment,
  userInit,
  ...initClientForm
}: GqlProviderProps) => {
  const router = useRouter();
  const uiOperation = st.use.uiOperation();
  const self = useSelf();
  const myKeyring = st.use.myKeyring();
  const [cookie, , removeCookie] = useCookies<"accessToken", { accessToken?: { jwt: string } }>(["accessToken"]);
  useEffect(() => {
    themeChange(false);
    logger.setLevel(environment === "main" ? "warn" : "trace");
    pageMap.set(initClientForm.pageMap);
    if (router.query["skipBlocks"] === "true") initClientForm.pageMap.blockCountries = [];
    (async () => {
      await st.do.initClient({ ...initClientForm, jwt: (router.query.jwt as string) ?? cookie.accessToken?.jwt });
      init && (await init());
    })();
    const u1 = st.sub((state) => state.me, st.do.checkAuth);
    const u2 = st.sub((state) => state.me, st.do.checkAuth);
    return () => {
      u1();
      u2();
    };
  }, [router.query.jwt]);
  useEffect(() => {
    if (!self?.id?.length || !myKeyring.id?.length) return;
    removeCookie("accessToken", { path: "/" });
    console.log("cookieRemove");
    userInit && userInit(self, myKeyring);
  }, [self, myKeyring]);
  useEffect(() => {
    st.do.checkAuth();
  }, [router.pathname, uiOperation]);
  useEffect(() => {
    const handleResize = () => window && st.set({ innerWidth: window.innerWidth, innerHeight: window.innerHeight });
    handleResize();
    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, []);
  return <div className="frameRoot">{uiOperation === "idle" && Router.isReady && children}</div>;
};
