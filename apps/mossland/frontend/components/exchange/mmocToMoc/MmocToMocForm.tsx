import React from "react";
import styled from "styled-components";
import { darken } from "polished";
import { gql, st, store } from "../../../stores";
import { client } from "@shared/util-client";

export const MmocToMocForm = () => {
  const self = st.use.self();
  const wallet = st.use.wallet();
  const ownershipList = st.use.ownershipListInMoney();
  const depositAmount = st.use.depositAmount();
  const depositAddress = st.use.depositAddress();
  const myKeyring = st.use.myKeyring();

  const max = () => {
    if (!self) return 0;
    if (ownershipList === "loading") return 0;
    const mmoc = gql.shared.Ownership.get(ownershipList, "MMOC");
    if (!mmoc) return 0;
    return Math.floor(mmoc.value);
  };

  return (
    <div>
      <p className="text-black font-normal text-[16px] leading-[16px] mb-[6px]">Amount</p>
      <div className="bg-white flex items-center px-[14px] gap-[10px] border-[2px] border-solid border-black rounded-[8px]">
        <input
          className="border-0 py-[8px] flex-grow text-right text-[20px] text-black bg-white outline-none "
          disabled={!wallet}
          min={0}
          max={max()}
          type="number"
          value={depositAmount}
          onBlur={(e) => st.do.setDepositAmount(max() < e.target.valueAsNumber ? max() : e.target.valueAsNumber)}
          onChange={(e) => st.do.setDepositAmount(max() < e.target.valueAsNumber ? max() : e.target.valueAsNumber)}
        />
        <div className="font-bold text-gray-500 text-[20px] leading-[20px]">MMOC</div>
        <button
          id="max-button"
          className="font-bold bg-transparent text-color-main text-[20px] leading-[20px]"
          onClick={() => st.do.setDepositAmount(max())}
        >
          MAX
        </button>
      </div>
      <p className="font-normal text-[16px] leading-[16px] text-right mt-[6px] mb-[9px] text-black">
        = {isNaN(depositAmount) ? 0 : depositAmount} MOC
      </p>
      <p className="text-black font-normal text-[16px] leading-[16px] mb-[6px]">Address</p>
      <div className="bg-white flex items-center px-[14px] gap-[10px] border-[2px] border-solid border-black rounded-[8px]">
        <input
          disabled={!myKeyring.wallets.length}
          className="border-0 py-[8px] flex-grow text-right text-[20px] text-black bg-white outline-none "
          value={depositAddress}
          placeholder="0x0000000000000000000000000000000000000000"
          onChange={(e) => st.set({ depositAddress: e.target.value })}
        />
      </div>
    </div>
  );
};
