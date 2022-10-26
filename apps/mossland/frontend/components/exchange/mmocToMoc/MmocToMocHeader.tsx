import React from "react";
import { ExchangeDetailHeader } from "@platform/ui-web";

export const MmocToMocHeader = () => {
  return (
    <ExchangeDetailHeader
      from={
        <>
          <img src="/images/mm_coin.png" />
          MMOC
        </>
      }
      to={
        <>
          <img src="/images/m_coin.png" />
          MOC
        </>
      }
    />
  );
};
