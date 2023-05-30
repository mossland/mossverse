"use client";
import { Image } from "@shared/client";
import { Utils } from "@util/client";
import { fetch, st } from "@mossland/client";
import React from "react";

type MyBalanceProps = {
  isHideMoc?: boolean;
  isHideMmoc?: boolean;
};

export const MyBalance = (props: MyBalanceProps) => {
  const ownershipMap = st.use.ownershipMap();
  const mmoc = ownershipMap !== "loading" ? fetch.shared.Ownership.getByName([...ownershipMap.values()], "MMOC") : null;

  return (
    <div className="w-full mt-2 ">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-bold items-center flex gap-2 text-[18px] md:text-[22px] text-[#555]">
            <div className="relative w-5 h-5">
              <Image src={"/images/mm_coin.png"} />
            </div>
            MMOC
          </div>
          <div className="text-[18px] md:text-[22px]">{mmoc?.value ? Utils.numberWithCommas(mmoc.value) : 0}</div>
        </div>
      </div>
    </div>
  );
};
