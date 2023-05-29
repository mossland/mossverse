"use client";
import * as MocWallet from "./_client";
import { BiDownArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { Common, fetch, st } from "@mossland/client";
import { DataEditModal, DataListContainer, Image, LoadUnits } from "@shared/client";
import { DefaultOf, ModelsProps, ServerInit } from "@util/client";
import { useState } from "react";

export const Admin = ({ sliceName = "mocWallet", init }: ModelsProps<fetch.MocWallet>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={MocWallet.Unit.Admin}
      renderDashboard={MocWallet.Util.Stat}
      queryMap={fetch.mocWalletQueryMap}
      edit={
        <DataEditModal
          sliceName={sliceName}
          renderTitle={
            (mocWallet: DefaultOf<fetch.MocWallet>) => "" // `${mocWallet.field}`
          }
        >
          <MocWallet.Edit.General />
        </DataEditModal>
      }
      type="list"
      columns={["type", { key: "field", render: (field: string) => <span>{field}</span> }, "status", "createdAt"]}
      actions={(mocWallet: fetch.LightMocWallet, idx) => ["remove", "edit"]}
    />
  );
};

interface TradeHistoryProps {
  init: ServerInit<"receipt", fetch.platform.LightReceipt>;
}

export const TradeHistory = ({ init }: TradeHistoryProps) => {
  return (
    <div className="overflow-hidden border-black ">
      <div className="md:block hidden h-[44px] text-[22px]  leading-[44px] text-center border-b-[2px] border-solid border-b-black">
        History
      </div>
      <LoadUnits
        init={init}
        renderItem={(receipt: fetch.platform.LightReceipt) => (
          <div className="px-[22px] py-[20px] border-b-2" key={receipt.id}>
            <div className="flex justify-between text-black text-[18px]">
              <div className="flex items-center justify-center gap-2">
                {receipt.inputs[0] &&
                  (receipt.inputs[0].type === "currency" ? (
                    <div className="flex items-center justify-center">
                      <div className="flex mr-2 ">
                        <Image width={20} height={20} src="/images/m_coin.png" />
                      </div>
                      <div className="text-black text-[18px]">MOC</div>
                    </div>
                  ) : receipt.inputs[0].type === "thing" ? (
                    <div className="flex items-center justify-center">
                      <div className="flex items-center justify-center mr-2 ">
                        <Image width={20} height={20} src={receipt.inputs[0].thing?.image.url ?? ""} />
                      </div>
                      <div className="text-black text-[18px]">{receipt.inputs[0].thing?.name}</div>
                    </div>
                  ) : receipt.inputs[0] && receipt.inputs[0].type === "token" ? (
                    <div className="flex items-center justify-center">
                      <div className="flex items-center justify-center mr-2 ">
                        <Image
                          width={20}
                          height={20}
                          src={
                            (receipt.inputs[0] &&
                              receipt.inputs[0].token &&
                              receipt.inputs[0].token.meta &&
                              receipt.inputs[0].token?.meta.image) ??
                            ""
                          }
                        />
                      </div>
                      <div className="text-black text-[18px]">{receipt.inputs[0].token?.meta?.name}</div>
                    </div>
                  ) : (
                    <></>
                  ))}
                <BiRightArrowAlt />
                {receipt.outputs[0] &&
                  (receipt.outputs[0].type === "currency" ? (
                    <div className="flex items-center justify-center">
                      <div className="flex items-center justify-center mr-2 ">
                        <Image className="w-[3px] h-[3px]" width={16} height={16} src="/images/m_coin.png" />
                      </div>
                      <div className="text-black text-[18px]">MOC</div>
                    </div>
                  ) : receipt.outputs[0].type === "thing" ? (
                    <div className="flex items-center justify-center">
                      <div className="flex items-center justify-center mr-2 ">
                        <Image
                          className="w-[3px] h-[3px]"
                          width={16}
                          height={16}
                          src={receipt.outputs[0].thing?.image.url ?? ""}
                        />
                      </div>
                      <div className="text-black text-[18px]">{receipt.outputs[0].thing?.name}</div>
                    </div>
                  ) : receipt.outputs[0] && receipt.outputs[0].type === "token" ? (
                    <div className="flex items-center justify-center">
                      <div className="flex items-center justify-center mr-2 ">
                        <Image
                          className="w-[3px] h-[3px]"
                          width={16}
                          height={16}
                          src={
                            (receipt.outputs[0] &&
                              receipt.outputs[0].token &&
                              receipt.outputs[0].token.meta &&
                              receipt.outputs[0].token.meta.image) ??
                            ""
                          }
                        />
                      </div>
                      <div className="text-black text-[18px]">{receipt.outputs[0].token?.meta?.name}</div>
                    </div>
                  ) : (
                    <></>
                  ))}
              </div>
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
  );
};

export const Deposit = () => {
  const [step, setStep] = useState(0);
  const self = st.use.self();
  const mocWallet = st.use.mocWallet();
  return (
    <div>
      {!step ? (
        <div>
          <div className="px-[23px] py-4 ">
            <p className="text-[22px] leading-[1em]">
              No MOC deposit addresses have been applied for before. Please retrieve the deposit address.
            </p>
            <img className="block text-center mx-auto my-[43px]" src="/images/qr_icon.svg" />
            <Common.SubmitButton onClick={() => setStep(1)}>
              <BiDownArrowAlt />
              Get Address
            </Common.SubmitButton>
          </div>
        </div>
      ) : step === 1 ? (
        <div className="text-center h-screen md:h-auto flex md:block items-center justify-center leading-[1em] px-[23px] py-[44px]  border-black">
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
            <Common.SubmitButton
              onClick={async () => {
                await st.do.deposit(self.id);
                setStep(2);
              }}
            >
              I understand
            </Common.SubmitButton>
          </div>
        </div>
      ) : (
        step === 2 && mocWallet !== "loading" && <MocWallet.View.QrCode mocWallet={mocWallet} />
      )}
    </div>
  );
};
