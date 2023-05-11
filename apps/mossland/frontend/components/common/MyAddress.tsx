import React from "react";
import { gql, st, store } from "../../stores";

export const MyAddress = () => {
  // const wallet = st.use.wallet();
  const me = st.use.myKeyring();
  // if (wallet === "loading") return null;
  return (
    <div className="bg-[#e8e8e8] min-h-[24px] md:min-h-fit py-[3px] md:py-[9px] px-[16px] rounded-[4px] overflow-hidden text-ellipsis whitespace-nowrap">
      <span>Address:</span>
      <br />
      {me.wallets[0].address}
    </div>
  );
};
