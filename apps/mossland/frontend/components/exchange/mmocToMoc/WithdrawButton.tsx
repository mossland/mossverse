import React, { useState } from "react";
import { ExchangeCancelButton, MmocToMocButton } from "@platform/ui-web";
import { ethers } from "ethers";
import { gql, st, store } from "../../../stores";
import { message } from "antd";
import { BiRightArrowAlt } from "react-icons/bi";

export const WithdrawButton = () => {
  const self = st.use.self();
  const depositAmount = st.use.depositAmount();
  const depositAddress = st.use.depositAddress();
  const [agreed, setAggreed] = useState<boolean>(false);
  const disabled = !ethers.utils.isAddress(depositAddress) || !depositAmount || !agreed;
  // const receipt = st.use.receipt();
  const onWithdraw = async () => {
    if (!self) return message.error("please login after withdraw.");
    await st.do.withdraw(self.id, depositAddress, depositAmount);
    message.success("withdraw success");
    setAggreed(false);
    st.do.setDepositAddress("");
    st.do.setDepositAmount(0);
    // toast.success(`withdraw suceess!`);
  };
  return (
    <div className="flex-1 justify-center items-center py-[33px] gap-[10px]">
      <div className="flex gap-5 mb-5 font-bold text-red-500">
        <input
          type={"checkbox"}
          className="duration-500 "
          checked={agreed}
          onChange={(e) => setAggreed(e.target.checked)}
        />
        * 환전하고자 하는 금액과 받는 주소를 다시 한 번 확인해주세요!
        <br />
        &nbsp;&nbsp;환전 요청 이후엔 취소할 수 없습니다.
      </div>
      <button
        className="flex w-full bg-gradient-to-l from-color-main rounded-[10px] p-[13px] items-center justify-center font-normal text-[22px] leading-[22px] border-[2px] border-solid border-black disabled:from-gray-400 disabled:to-gray-400 disabled:opacity-40 disabled:cursor-auto"
        disabled={disabled}
        onClick={onWithdraw}
      >
        <img className="w-[18px] inline-block mr-[4px] align-baseline" src="/images/mm_coin.png" />
        MMOC <BiRightArrowAlt className="mx-[3px]" />{" "}
        <img className="w-[18px] inline-block mr-[4px] align-baseline" src="/images/m_coin.png" /> MOC
      </button>
    </div>
  );
};

// const MmcoToMocFooterContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 13px 22px;
//   gap: 10px;
//   svg {
//     display: inline-block;
//   }
//   & div {
//     flex: 1;
//   }
// `;
