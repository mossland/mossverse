import React from "react";
import { ExchangeDetailHeader } from "@platform/ui-web";

export const McoToMmocHeader = () => {
  return (
    <ExchangeDetailHeader
      from={
        <>
          <img src="/images/m_coin.png" />
          MOC
        </>
      }
      to={
        <>
          <img src="/images/mm_coin.png" />
          MMOC
        </>
      }
    />
  );
};
