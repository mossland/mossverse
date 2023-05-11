import React from "react";
import { ExchangeCancelButton, CopyAddressButton } from "@platform/ui-web";
import { gql, st, store } from "../../../stores";

export const MocToMmocFooter = () => {
  // const copyAddressCallback = store.platform.exchange.use.copyAddressCallback();
  return (
    <div className="flex justify-center items-center py-[13px] px-[22px] gap-[10px]">
      <ExchangeCancelButton />
      {/* <CopyAddressButton address={""} onClick={copyAddressCallback} type="defaultButton" /> */}
    </div>
  );
};
