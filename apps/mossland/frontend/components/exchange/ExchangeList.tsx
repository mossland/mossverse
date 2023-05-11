import React, { useEffect } from "react";
import { ExchangeItem } from "@platform/ui-web";
import { gql, st, store } from "../../stores";

export const ExchangeList = () => {
  const receiptList = st.use.receiptList();

  return (
    <div
      className={`h-[calc(100vh-220px)] ${
        receiptList === "loading" || !receiptList.length
          ? "md:h-screen md:overflow-hidden"
          : "md:h-[calc(100vh-144px)] overflow-auto"
      } overflow-auto mr-[-2px] md:border-r-[2px] md:border-r-solid border-r-black`}
    >
      {receiptList === "loading" || !receiptList.length ? (
        <div className="w-full h-[100vh] text-[22px] flex items-center justify-center">There is no exchage history</div>
      ) : (
        <div className="">
          {receiptList.map((receipt) => (
            <ExchangeItem key={receipt.id} receipt={receipt as gql.platform.Receipt} />
          ))}
        </div>
      )}
    </div>
  );
};
