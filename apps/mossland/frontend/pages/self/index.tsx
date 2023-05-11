import React, { useEffect } from "react";
import { MarketHeader, MenuBar, MyTokensHeader } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import { env } from "../../env/env";
import { Raffle, Listing } from "@platform/ui-web";
import Router from "next/router";
import { LoadItems } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";

export default function Page() {
  const self = st.use.self();
  const thingList = st.use.thingList();
  // useEffect(() => {

  // }, [self, Router.pathname]);

  useEffect(() => {
    //! filter가 없으면 All로 초기화
  }, []);

  return (
    <div className="overflow-hidden">
      <MyTokensHeader />
    </div>
  );
}
