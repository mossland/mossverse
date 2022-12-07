import { ApolloProvider } from "@apollo/client";
import { client, InitClientForm, PageMap, WalletNetworkType } from "@shared/util-client";
import React, { ReactNode, useEffect, useState } from "react";
import { gql, store } from "@shared/data-access";
import { cnst } from "@shared/util";
import { useRouter } from "next/router";
import { message, notification } from "antd";

type GqlProviderProps = {
  pageMap: PageMap;
  uri: string;
  ws: string | null;
  networkType?: WalletNetworkType;
  init?: () => Promise<void>;
  children: ReactNode;
  useSelf: () => { id: string } | null;
  whoAmI: () => Promise<void>;
};

export const GqlProvider = ({ children, useSelf, init, ...initClientForm }: GqlProviderProps) => {
  const router = useRouter();
  const uiOperation = store.ui.use.uiOperation();
  const [msg, msgContext] = message.useMessage();
  const [noti, notiContext] = notification.useNotification();

  useEffect(() => {
    if (router.query["skipBlocks"] === "true") initClientForm.pageMap.blockCountries = [];
    (async () => {
      await store.ui.do.initClient(router, { ...initClientForm, msg, noti });
      init && init();
    })();
    const u1 = store.admin.subscribe((state) => state.me, store.ui.do.checkAuth);
    const u2 = store.keyring.subscribe((state) => state.me, store.ui.do.checkAuth);
    return () => {
      u1();
      u2();
    };
  }, []);

  return (
    <>
      {/* <ApolloProvider client={client.gql}> */}
      {uiOperation === "idle" && children}
      {/* </ApolloProvider> */}
      {msgContext}
      {/* {notiContext} */}
    </>
  );
};
