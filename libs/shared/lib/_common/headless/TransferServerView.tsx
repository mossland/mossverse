"use client";
import { Utils } from "@util/client";
import { gqlTemp, st } from "@shared/client";
import { useEffect } from "react";

export default function TrasferServerView({ refName, model }: { refName: string; model: any }) {
  useEffect(() => {
    const mapName = `${refName}Map`;
    const map = st.get()[mapName];
    const modelMap = map === "loading" ? new Map() : new Map(map);
    const crystal = gqlTemp[`crystalize${Utils.capitalize(refName)}`](model);
    modelMap.set(model.id, crystal);
    st.set({ [refName]: crystal, [mapName]: modelMap, [`${refName}Form`]: Utils.deepObjectify(crystal) });
  }, []);
  return <></>;
}
