import React, { useEffect } from "react";
import { gql, utils, store } from "../stores";
import { cnst } from "@shared/util";
import { env } from "../env";
import { client } from "@shared/util-client";

export const usePageInit = () => {
  const self = store.platform.user.use.self();
  const initUser = store.platform.user.use.initWithOtp();
  const initNetwork = store.shared.network.use.initNetwork();
  const initKeyring = store.shared.keyring.use.init();

  useEffect(() => {
    client.setLink(env.endpoint);
    initUser();
    initNetwork({ query: { type: env.networkType } });
    initKeyring();
  }, [self]);
};
