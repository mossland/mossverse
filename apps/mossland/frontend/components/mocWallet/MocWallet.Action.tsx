import { gql, st } from "@mossland/frontend/stores";
import Router from "next/router";
import { BiDownArrowAlt } from "react-icons/bi";
import { MintButton } from "./../common";

type DepositStep1Type = {
  // onClick: () => void;
  // isDisabled: boolean;
};
export const DepositStep1 = () => {
  return (
    <div className="p-[23px] border-b-[2px] border-black">
      <p className="text-[22px] leading-[1em]">
        No MOC deposit addresses have been applied for before. Please retrieve the deposit address.
      </p>
      <img className="block text-center mx-auto my-[43px]" src="/images/qr_icon.svg" />
      <MintButton
        onClick={() => {
          Router.replace("/mocWallet?step=1");
        }}
      >
        <BiDownArrowAlt />
        Get Address
      </MintButton>
    </div>
  );
};

interface DepositStep2Props {
  //
  self: gql.User;
}

export const DepositStep2 = ({ self }: DepositStep2Props) => {
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
        <MintButton
          onClick={async () => {
            Router.replace("/mocWallet?step=2");
            await st.do.deposit(self.id);
          }}
        >
          I understand
        </MintButton>
      </div>
    </div>
  );
};
