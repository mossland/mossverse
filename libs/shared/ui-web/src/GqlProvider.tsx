import { ApolloProvider } from "@apollo/client";
import { client, setLink } from "@shared/util-client";
import React, { ReactNode, useEffect, useState } from "react";
import { store } from "@shared/data-access";
import { cnst } from "@shared/util";
type GqlProviderProps = {
  uri: string;
  ws?: string | null;
  networkType?: cnst.NetworkType;
  children: ReactNode;
};

export const GqlProvider = ({ children, uri, ws, networkType = "ganache" }: GqlProviderProps) => {
  const uiOperation = store.ui.use.uiOperation();
  const initGql = store.ui.use.initGql();
  const checkAuth = store.ui.use.checkAuth();
  useEffect(() => {
    initGql(uri, ws ?? null, networkType);
    const u1 = store.admin.subscribe((state) => state.me, checkAuth);
    const u2 = store.keyring.subscribe((state) => state.me, checkAuth);
    return () => {
      u1();
      u2();
    };
  }, []);
  return <ApolloProvider client={client}>{uiOperation !== "sleep" && children}</ApolloProvider>;
};
