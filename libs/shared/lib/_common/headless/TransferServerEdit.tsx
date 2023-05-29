"use client";
import { Utils } from "@util/client";
import { gqlTemp, st } from "@shared/client";
import { useEffect } from "react";

export default function TransferServerEdit<T extends string, L>({
  refName,
  model,
  modal,
}: {
  refName: string;
  model: any;
  modal?: string;
}) {
  useEffect(() => {
    const mapName = `${refName}Map`;
    const modelMap = new Map(st.get()[mapName]);
    const crystal = gqlTemp[`crystalize${Utils.capitalize(refName)}`](model);
    modelMap.set(model.id, crystal);
    st.set({
      [mapName]: modelMap,
      [`${refName}Form`]: Utils.deepObjectify(crystal),
      [`${refName}Modal`]: modal ?? "edit",
    });
  }, []);
  return <></>;
}
