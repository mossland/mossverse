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
import { listingStore, userStore } from "@platform/data-access";
import { PlatformLayout } from "@platform/ui-web";
import { useInterval } from "@shared/util-client";
import { GqlProvider } from "@shared/ui-web";
import { usePageInit } from "../../hooks";
import { env } from "../../env";
import { setToken } from "@shared/data-access";

export function Market() {
  usePageInit();
  const filter = listingStore.use.filter();
  const marketAddr = process.env.NEXT_PUBLIC_REACT_APP_MARKET_CONTRACT;

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
    listingStore.setState({ marketAddr });
  }, []);
  return (
    <GqlProvider uri={env.endpoint}>
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

export default Market;
