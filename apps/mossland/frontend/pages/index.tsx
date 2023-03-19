import dynamic from "next/dynamic";
import { gql, st } from "@mossland/frontend/stores";
import { GqlProvider, LoadItems } from "@shared/ui-web";
import { env } from "../env/env";
import { PageMap } from "@shared/util-client";
import { Map } from "@decentverse/ui-web";
import Router from "next/router";
import { useEffect } from "react";

export function Index() {
  const mapList = st.use.mapList();
  useEffect(() => {
    st.do.initMap({ limit: 0 });
  }, []);
  useEffect(() => {
    if (mapList === "loading") return;
    const map = mapList.find((map) => map.name === "mossland2");
    if (map) Router.push(`/map/${map.id}`);
  }, [mapList]);
  return <div className=""></div>;
}

export default Index;
