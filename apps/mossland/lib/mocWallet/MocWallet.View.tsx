import { BiCopyAlt } from "react-icons/bi";
import { Copy } from "@shared/client";
import { QRCodeSVG } from "qrcode.react";
import { fetch } from "@mossland/client";
import React from "react";
interface GeneralProps {
  mocWallet: fetch.MocWallet;
}
export const General = ({ mocWallet }: GeneralProps) => {
  return <></>;
};

type QrCodeType = {
  mocWallet: fetch.MocWallet;
};

export const QrCode = ({ mocWallet }: QrCodeType) => {
  return (
    <div className="p-[32px] h-screen md:h-auto flex md:block items-center justify-center md:border-b-[2px] border-b-solid border-b-black">
      <div>
        <h4 className="text-[18px] text-balck mb-[5px] leading-[1em]">Deposit Address</h4>
        <p className="text-gray-500 font-normal text-[16px] leading-[16px] mb-[8px]">
          Send only MOC to this deposit address.
        </p>
        <div className="flex items-center justify-center ">
          <QRCodeSVG className="my-[42px]" value={mocWallet.address} />
        </div>
        <div className="border-[2px]  break-all rounded-[8px] border-black border-solid flex justify-between mb-[30px]">
          <div className="px-[10px] py-[10px] flex-grow whitespace-normal">
            <div>Address:</div>
            {mocWallet.address}
          </div>
          <Copy text={mocWallet.address}>
            <div className="bg-primary w-[44px] flex items-center justify-center cursor-pointer transition duration-500 rounded-br-[6px] rounded-tr-[6px] hover:bg-opacity-80">
              <BiCopyAlt />
            </div>
          </Copy>
        </div>
      </div>
    </div>
  );
};
