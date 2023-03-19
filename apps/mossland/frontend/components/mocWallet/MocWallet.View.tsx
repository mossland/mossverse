import React from "react";
import { Utils } from "@shared/util";
import { CopyAddressButton } from "@platform/ui-web";
import { gql, st, store } from "@mossland/frontend/stores";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-toastify";

interface MocWalletViewProps {
  //
  mocWallet: gql.MocWallet;
}
export const MocWalletView = ({ mocWallet }: MocWalletViewProps) => {
  return <></>;
};

type MocWalletViewQrCodeType = {
  mocWallet: gql.MocWallet;
};

export const MocWalletViewQrCode = ({ mocWallet }: MocWalletViewQrCodeType) => {
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
          <CopyAddressButton
            address={mocWallet.address}
            onClick={(copyText: string) => toast.success(`copied! : ${Utils.centerEllipsis(copyText)}`)}
            type="icon"
          />
        </div>
      </div>
    </div>
  );
};

MocWalletView.QrCode = MocWalletViewQrCode;
