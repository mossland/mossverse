import React, { useEffect } from "react";
import styled from "styled-components";
import { gql, st, store } from "../../stores";
import { Common } from "@mossland/frontend/components";
import { BiCheck, BiChevronLeft } from "react-icons/bi";
import { CheckIcon } from "@shared/ui-web";
import Router from "next/router";

export const MyTokensHeader = () => {
  const self = st.use.self();
  const listingListInSelf = st.use.listingListInSelf();
  const ownershipList = st.use.ownershipListInItem();

  return (
    <div className="px-[33px] py-[20px] h-[107] border-b-[2px] border-b-black">
      <div className="flex justify-center">
        <div className="flex items-center w-1/2">
          <button className=" bg-transparent mt-[6px] mr-[7px]" onClick={() => Router.push("/listing")}>
            <BiChevronLeft className="text-black text-[18px] md:text-[26px]" />
          </button>
          <h2 className="text-[18px] text-black md:text-[26px]">MyTokens</h2>
        </div>
        <div className="w-1/2">
          <Common.MyAddress />
        </div>
      </div>
      <div className="flex mt-[10px]">
        <>
          <button
            className={`border-[1px] border-solid border-gray flex items-center justify-center mr-[6px] pr-[14px] py-[3px] rounded-[6px] border-gray text-gray font-bold text-[14px] leading-[14px]  ${
              Router.pathname.includes("ownership") ? "border-black text-black" : " opacity-50"
            } `}
            onClick={() => Router.push("/self/ownership")}
          >
            <BiCheck
              className={`text-[16px]  ${Router.pathname.includes("ownership") ? "text-black" : "text-transparent"}`}
            />
            Sellable ({ownershipList.length})
          </button>
          <button
            className={`border-[1px] border-solid border-gray flex items-center justify-center mr-[6px]  pr-[14px] py-[3px] rounded-[6px] border-gray text-gray font-bold text-[14px] leading-[14px bg-color-extra ${
              Router.pathname.includes("listing") ? "border-black text-black" : " opacity-50"
            } `}
            onClick={() => Router.push("/self/listing")}
          >
            <BiCheck
              className={`text-[16px] ${Router.pathname.includes("listing") ? "text-black" : "text-transparent"}`}
            />
            On Sale({listingListInSelf.length})
          </button>
        </>
      </div>
    </div>
  );
};
