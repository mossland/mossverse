import React from "react";
import { BiDownArrowAlt } from "react-icons/bi";
import { MintButton } from "../../common";

type MocToMMocStep1Type = {
  onClick: () => void;
  isDisabled: boolean;
};
export const MocToMmocStep1 = ({ onClick, isDisabled }: MocToMMocStep1Type) => {
  return (
    <div className="p-[23px] border-b-[2px] border-black">
      <p className="text-[22px] leading-[1em]">
        No MOC deposit addresses have been applied for before. Please retrieve the deposit address.
      </p>
      <img className="block text-center mx-auto my-[43px]" src="/images/qr_icon.svg" />
      <MintButton disabled={isDisabled} onClick={onClick}>
        <BiDownArrowAlt />
        Get Address
      </MintButton>
    </div>
  );
};
