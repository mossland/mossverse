import React from "react";
import { BiDownArrowAlt } from "react-icons/bi";
import { MintButton } from "../../common";

type MocToMmocStep2 = {
  onClick: () => void;
};

export const MocToMmocStep2 = ({ onClick }: MocToMmocStep2) => {
  return (
    <div className="text-center h-screen md:h-auto flex md:block items-center justify-center leading-[1em] px-[23px] py-[44px] md:border-b-[2px] border-black">
      <div>
        <h3 className="text-[26px] font-bold mb-[14px] leading-[1.1em]">
          Send only MOC to this
          <br />
          deposit address.
        </h3>
        <p className="text-[20px] leading-[1.2em]">
          Sending any other asset, will
          <br />
          result permanent loss
        </p>
        <img src="/images/bank.svg" className="block text-center mx-auto my-[25px]" />
        <MintButton onClick={onClick}>I understand</MintButton>
      </div>
    </div>
  );
};
