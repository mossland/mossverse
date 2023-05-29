"use client";
import * as Placement from "./_client";
import { LoadUnits } from "@shared/client";
import { ModelsProps, ServerInit } from "@util/client";
import { fetch, st } from "@decentverse/client";
import { useEffect } from "react";

export const Admin = ({ sliceName = "placement", init }: ModelsProps<fetch.Placement>) => {
  const placementMap = st.use.placementMap();
  useEffect(() => {
    init && st.do.initPlacement(init);
  }, [init]);
  return (
    <>
      {(placementMap === "loading" ? [] : [...placementMap.values()]).map((placement) => (
        <Placement.Unit.Admin key={placement.id} placement={placement} />
      ))}
    </>
  );
};

interface WorldProps {
  init: ServerInit<"placement", fetch.LightPlacement>;
}
export const World = ({ init }: WorldProps) => {
  return (
    <LoadUnits
      noDiv
      init={init}
      renderItem={(placement: fetch.LightPlacement) => <Placement.Unit.World key={placement.id} placement={placement} />}
    />
  );
};
