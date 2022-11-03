import React, { useEffect } from "react";
import {
  DetailModal,
  MarketBalance,
  MarketNav,
  MarketList,
  DetailMobileModal,
  MyTokensHeader,
  MarketHeader,
} from "../../components";

import { gql, utils, store } from "../../stores";
import { PlatformLayout } from "@platform/ui-web";
import { useInterval } from "@shared/util-client";
import { GqlProvider } from "@shared/ui-web";
import { usePageInit } from "../../hooks";
import { env } from "../../env";

export function MarketPage() {
  usePageInit();
  const filter = store.platform.listing.use.filter();
  const marketAddr = env.klaytn.marketAddr;

  // const data = { foo: "bar" };
  // const event = new CustomEvent("myCustomEvent", { detail: data });
  // window.parent.document.dispatchEvent(event);

  // useInterval(() => {
  //   window?.top?.postMessage("I am Iframe", "*");
  // }, 1000);
  // window.onmessage = (event) => {
  //   console.log("Parent received successfully.", event);
  // };

  useEffect(() => {
    store.platform.listing.setState({ marketAddr });
  }, []);
  return (
    <GqlProvider uri={env.endpoint} ws={env.ws} networkType={env.networkType}>
      <PlatformLayout>
        {filter === "myTokens" ? (
          <MyTokensHeader />
        ) : (
          <MarketHeader />
          //   <MarketBalance />
          //   <MarketNav />
          // </>
        )}
        <MarketList />
        <div className="only-pc">
          <DetailModal />
        </div>
        <div className="only-mobile">
          <DetailMobileModal />
        </div>
      </PlatformLayout>
    </GqlProvider>
  );
}

export default MarketPage;
