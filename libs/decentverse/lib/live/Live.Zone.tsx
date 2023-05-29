"use client";
import * as Live from "./_client";
import { LoadUnits } from "@shared/client";
import { ModelsProps, ServerInit } from "@util/client";
import { fetch, st } from "@decentverse/client";
import { useEffect } from "react";

export const Admin = ({ sliceName = "live", init }: ModelsProps<fetch.Live>) => {
  const liveMap = st.use.liveMap();
  useEffect(() => {
    init && st.do.initLive(init);
  }, [init]);
  return (
    <>
      {(liveMap === "loading" ? [] : [...liveMap.values()]).map((live) => (
        <Live.Unit.Admin key={live.id} live={live} />
      ))}
    </>
  );
};

interface WorldProps {
  init: ServerInit<"live", fetch.LightLive>;
}
export const World = ({ init }: WorldProps) => {
  return (
    <LoadUnits noDiv init={init} renderItem={(live: fetch.LightLive) => <Live.Unit.World key={live.id} live={live} />} />
  );
};
