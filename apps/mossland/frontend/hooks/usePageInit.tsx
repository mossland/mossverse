import React, { useEffect } from "react";
import { types, userStore, listingStore } from "@platform/data-access";
import { keyringStore, networkStore, setLink, walletStore } from "@shared/data-access";
import { cnst } from "@shared/util";
import { env } from "../env";

export const usePageInit = () => {
  const self = userStore.use.self();
  const initUser = userStore.use.initWithOtp();
  const initnetwork = networkStore.use.init();
  const initKeyring = keyringStore.use.init();

  useEffect(() => {
    setLink(env.endpoint);
    initUser();
    initnetwork(env.networkType);
    initKeyring(env.networkType);
  }, [self]);
};
