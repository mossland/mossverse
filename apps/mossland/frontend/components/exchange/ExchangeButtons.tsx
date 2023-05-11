import React from "react";
import styled from "styled-components";
import { BiRightArrowAlt } from "react-icons/bi";
import Link from "next/link";
import { gql, st, store } from "../../stores";
import Router from "next/router";

export const ExchangeButtons = () => {
  const self = st.use.self();

  return (
    <div className="mt-[10px] mb-[20px] flex justify-between gap-[16px]">
      {/* <Link href="/mocWallet/deposit" passHref> */}
      <button
        disabled={!self.id}
        className="flex items-center justify-center text-[22px] bg-gradient-to-r from-white to-[#f5b5ff] border-[2px] border-solid rounded-[10px] px-[13px] py-[5px] border-black
          disabled:from-[#f5b5ff] disabled:to-[#f5b5ff] disabled:opacity-40 disabled:cursor-default text-black"
        onClick={() => Router.push("/mocWallet/deposit")}
      >
        MOC
        <BiRightArrowAlt />
        <img className="w-[22px] h-[22px] mr-2" src="/images/mm_coin.png" />
        MMOC
      </button>

      <button
        disabled={!self.id}
        className="flex items-center h-[48px] justify-center text-[22px] bg-gradient-to-r from-white to-color-main border-[2px] border-solid rounded-[10px] p-[13px] border-black
          text-blackdisabled:from-color-main disabled:to-color-main disabled:opacity-40 disabled:cursor-default text-black"
        onClick={() => Router.push("/mocWallet/withdraw")}
        id="mmoc-to-moc-button"
      >
        MMOC
        <BiRightArrowAlt />
        <img className="w-[22px] h-[22px] mr-2" src="/images/m_coin.png" />
        MOC
      </button>
    </div>
  );
};
