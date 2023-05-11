import React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import styled from "styled-components";

type MmocToMocButtonProps = {
  disabled: boolean;
  onClick: () => void;
};

export const MmocToMocButton = ({ disabled, onClick }: MmocToMocButtonProps) => {
  return (
    <button
      className="flex w-full bg-gradient-to-l from-color-main rounded-[10px] p-[13px] items-center justify-center font-normal text-[22px] leading-[22px] border-[2px] border-solid border-black disabled:from-gray-400 disabled:to-gray-400 disabled:opacity-40 disabled:cursor-auto"
      disabled={disabled}
      onClick={onClick}
    >
      <img className="w-[18px] inline-block mr-[4px] align-baseline" src="/images/mm_coin.png" />
      MMOC <BiRightArrowAlt className="mx-[3px]" />{" "}
      <img className="w-[18px] inline-block mr-[4px] align-baseline" src="/images/m_coin.png" /> MOC
    </button>
  );
};

const MmocToMocButtonContainer = styled.div<{ disabled: boolean }>`
  button {
    background: linear-gradient(270deg, #23fae6 27.6%, rgba(102, 254, 240, 0.3) 100%);
    &:disabled {
      /* background: #aaa; */
      /* border-color: #999;
      color: #666; */
      opacity: 0.6;
      cursor: auto;
    }
  }

  img {
    width: 18px;
    height: 18px;
    vertical-align: baseline;
    display: inline-block;
    margin-bottom: -2px;
    margin-right: 4px;
  }
`;
