"use client";
import { ServerInit, Utils } from "@util/client";
import { gqlTemp, st } from "@shared/client";
import { useEffect } from "react";

export interface TransferServerInitProps<T extends string, L> {
  init: ServerInit<T, L>;
}
export default function TransferServerInit<T extends string, L>({ init }: TransferServerInitProps<T, L>) {
  useEffect(() => {
    const modelMap = new Map();
    init[`${init.refName}ObjList` as any].forEach((model) =>
      modelMap.set(model.id, gqlTemp[`lightCrystalize${Utils.capitalize(init.refName)}`](model))
    );
    st.set({
      [`${init.refName}Map`]: modelMap,
      [`${init.refName}InitMap`]: modelMap,
      ...(init as any),
      [`${init.refName}ObjList`]: undefined,
    });
  }, []);
  return <></>;
}
