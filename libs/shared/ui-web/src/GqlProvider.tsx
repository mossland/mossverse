import { ApolloProvider } from "@apollo/client";
import { client, InitClientForm, PageMap, WalletNetworkType } from "@shared/util-client";
import React, { ReactNode, useEffect, useState } from "react";
import { gql, store } from "@shared/data-access";
import { cnst } from "@shared/util";
import { useRouter } from "next/router";
import { message, notification } from "antd";

type GqlProviderProps = {
  useSelf: () => { id: string } | null;
  pageMap: PageMap;
  uri: string;
  ws: string | null;
  networkType?: WalletNetworkType;
  whoAmI: () => Promise<void>;
  children: ReactNode;
};

export const GqlProvider = ({ children, useSelf, ...initClientForm }: GqlProviderProps) => {
  const router = useRouter();
  const uiOperation = store.ui.use.uiOperation();
  const [msg, msgContext] = message.useMessage();
  const [noti, notiContext] = notification.useNotification();
  useEffect(() => {
    if (router.query["skipBlocks"] === "true") initClientForm.pageMap.blockCountries = [];
    store.ui.do.initClient(router, { ...initClientForm, msg, noti });
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
