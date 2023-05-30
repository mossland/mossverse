"use client";
import { Utils } from "@util/client";
import { st } from "@mossland/client";
import React from "react";

export const MyAddress = () => {
  const me = st.use.myKeyring();
  return (
    <div className="bg-[#e8e8e8] min-h-[24px] md:min-h-fit py-[3px] md:py-[9px] px-[16px] rounded-[4px] overflow-hidden text-ellipsis whitespace-nowrap">
      <span>Address:</span>
      <br />
      <div className="hidden md:block">{me.wallets[0].address}</div>
      <div className="block md:hidden">{Utils.centerEllipsis(me.wallets[0].address)}</div>
    </div>
  );
};
