"use client";
import { MapEditLayout } from "@decentverse/client";
import { Skeleton } from "@shared/client";
import { fetch, st } from "@mossland/client";
import { useEffect } from "react";

export default function Page({ params: { mapId } }) {
  const map = st.use.map();
  useEffect(() => {
    if (!mapId) return;
    st.do.editMap(mapId);
    st.do.setMapLayerView(fetch.decentverse.mapEditorLayerView);
  }, [mapId]);
  if (!mapId) return <Skeleton active />;
  return map === "loading" ? <></> : <MapEditLayout map={map} />;
}
