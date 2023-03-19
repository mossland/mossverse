import {
  ExchangeList,
  MocToMmocHeader,
  MmocToMocHeader,
  MmocToMocForm,
  WithdrawButton,
  ReceiptModal,
  ExchangeButtons,
  DepositStep,
  ExchangeHeader,
  MocWallet,
} from "../../components";
import { gql, st } from "../../stores";
import { LoadItems } from "@shared/ui-web";
import { useEffect } from "react";
import { ExchangeFlow, ExchangeItem } from "@platform/ui-web";
import { BiRightArrowAlt } from "react-icons/bi";
import Router from "next/router";

export default function Page() {
  const self = st.use.self();
  const mocWallet = st.use.mocWallet();
  const step = Router.query.step as string | undefined;
  useEffect(() => {
    self.id &&
      st.do.initReceipt({
        query: { from: self.id, type: "trade" },
        sort: { createdAt: -1 },
      });
  }, [self]);

  return (
    <div className="h-screen overflow-hidden">
      <ExchangeHeader />
      <div className="md:border-[2px] h-[calc(100vh-220px)] md:h-[calc(100vh-102px)] overflow-hidden border-solid border-black flex border-t-[2px]">
        <div className="flex-1 md:border-r-[2px] border-black overflow-hidden">
          <div className="md:block hidden h-[44px] text-[22px]  leading-[44px] text-center border-b-[2px] border-solid border-b-black">
            History
          </div>
          <LoadItems
            className=""
            slice={st.slice.receipt}
            init={{
              query: { from: self.id, type: "trade" },
            }}
            renderItem={(receipt: gql.platform.LightReceipt) => (
              <div className="px-[22px] py-[20px] border-b-2">
                <div className="flex justify-between text-black text-[18px]">
                  <ExchangeFlow input={receipt.inputs[0]} output={receipt.outputs[0]} />
                  {receipt.inputs[0].value} {receipt.inputs[0].getName()}
                </div>
                <div className="flex justify-between text-slate-500 text-[14px]">
                  {receipt.updatedAt.format("YYYY-MM-DD a hh:mm:ss")}
                  <div className="flex items-center text-[14px]">
                    <BiRightArrowAlt />
                    {receipt.outputs[0].value}
                    {receipt.outputs[0].getName()}
                  </div>
                </div>
              </div>
            )}
          />
        </div>
        <div className="flex-1 hidden overflow-auto md:block">
          <MocToMmocHeader />
          {!step ? (
            <MocWallet.Action.DepositStep1 />
          ) : step === "1" ? (
            <MocWallet.Action.DepositStep2 self={self} />
          ) : (
            step === "2" && mocWallet !== "loading" && <MocWallet.View.QrCode mocWallet={mocWallet} />
          )}
          <MmocToMocHeader />
          <div className="p-[23px] ml-[-2px]">
            <MmocToMocForm />
            <WithdrawButton />
          </div>
        </div>
      </div>
      {/* <ReceiptModal /> */}
    </div>
  );
}
