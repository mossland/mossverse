// "use client";
import { BiChevronLeft, BiRightArrowAlt } from "react-icons/bi";
import { Image, Link } from "@shared/client";
import { MocWallet, fetch } from "@mossland/client";
import { getAccount } from "@util/client";

export default async function Page() {
  const account = getAccount();
  const { receiptList, receiptInit } = await fetch.platform.initReceipt({
    query: { from: account?.id, type: "trade" },
    sort: { createdAt: -1 },
  });

  return (
    <div className="flex w-full h-[calc(100vh-220px)] md:h-[calc(100vh-111px)] border-solid border-black border-t-[2px]">
      <div className="w-full">
        <MocWallet.Zone.TradeHistory init={receiptInit} />
      </div>
      <hr className="h-full hidden md:block w-[0.1px] border-solid border-black border-[1px]" />
      <div className="hidden w-full overflow-hidden md:block">
        <div className="h-auto">
          <div className="relative  flex items-center justify-center md:h-[44px] md:border-b-[2px] md:border-black">
            <div className="absolute text-black top-[16px] left-[12px] text-[34px] md:hidden">
              <Link href="/exchange" passHref>
                <BiChevronLeft />
              </Link>
            </div>
            <div className="my-[20px] flex items-center font-bold text-[26px] leading-[26px] [&_img]:w-[18px] [&_img]:h-[18px] [&_img]:mr-[4px] [&_svg]:mx-[8px] md:text-[22px] md:leading-[44px] md:font-normal">
              <div className="relative w-5 h-5 mr-2">
                <Image src="/images/m_coin.png" />
              </div>
              MOC
              <BiRightArrowAlt />
              <div className="relative w-5 h-5 mr-2">
                <Image src="/images/mm_coin.png" />
              </div>
              MMOC
            </div>
          </div>
          <MocWallet.Zone.Deposit />
        </div>
        <div className="h-auto">
          <div className="relative  flex items-center justify-center md:h-[44px] md:border-y-[2px] md:border-black">
            <div className="absolute text-black top-[16px] left-[12px] text-[34px] md:hidden">
              <Link href="/exchange" passHref>
                <BiChevronLeft />
              </Link>
            </div>
            <div className="my-[20px] flex items-center font-bold text-[26px] leading-[26px] [&_img]:w-[18px] [&_img]:h-[18px] [&_img]:mr-[4px] [&_svg]:mx-[8px] md:text-[22px] md:leading-[44px] md:font-normal">
              <div className="relative w-5 h-5 mr-2">
                <Image src="/images/mm_coin.png" />
              </div>
              MMOC
              <BiRightArrowAlt />
              <div className="relative w-5 h-5 mr-2">
                <Image src="/images/m_coin.png" />
              </div>
              MOC
            </div>
          </div>
          <div className="p-[23px] ml-[-2px]">
            <MocWallet.Util.WithdrawForm />
            <MocWallet.Util.Withdraw />
          </div>
        </div>
      </div>

      {/* 
      <div className="md:border-[2px] h-[calc(100vh-220px)] md:h-[calc(100vh-102px)] overflow-hidden border-solid border-black flex border-t-[2px]">
        <div className="flex-1 md:border-r-[2px] border-black overflow-hidden">
          <div className="md:block hidden h-[44px] text-[22px]  leading-[44px] text-center border-b-[2px] border-solid border-b-black">
            History
          </div>
          {receiptMap === "loading" ? (
            <Skeleton active />
          ) : (
            <div>
              {[...receiptMap.values()].map((receipt) => (
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
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 hidden overflow-auto md:block">
          <div className="relative flex items-center justify-center md:h-[44px] md:border-b-[2px] md:border-black">
            <div className="absolute text-black top-[16px] left-[12px] text-[34px] md:hidden">
              <Link href="/exchange" passHref>
                <BiChevronLeft />
              </Link>
            </div>
            <div className="my-[20px] flex items-center font-bold text-[26px] leading-[26px] [&_img]:w-[18px] [&_img]:h-[18px] [&_img]:mr-[4px] [&_svg]:mx-[8px] md:text-[22px] md:leading-[44px] md:font-normal">
              <img src="/images/m_coin.png" />
              MOC
              <BiRightArrowAlt />
              <img src="/images/mm_coin.png" />
              MMOC
            </div>
          </div>
          {!step ? (
            <MocWallet.Util.DepositStep1 />
          ) : step === "1" ? (
            <MocWallet.Util.DepositStep2 self={self} />
          ) : (
            step === "2" && mocWallet !== "loading" && <MocWallet.View.QrCode mocWallet={mocWallet} />
          )}
          <div className="relative flex items-center justify-center md:h-[44px] md:border-b-[2px] md:border-black">
            <div className="absolute text-black top-[16px] left-[12px] text-[34px] md:hidden">
              <Link href="/exchange" passHref>
                <BiChevronLeft />
              </Link>
            </div>
            <div className="my-[20px] flex items-center font-bold text-[26px] leading-[26px] [&_img]:w-[18px] [&_img]:h-[18px] [&_img]:mr-[4px] [&_svg]:mx-[8px] md:text-[22px] md:leading-[44px] md:font-normal">
              <img src="/images/mm_coin.png" />
              MMOC
              <BiRightArrowAlt />
              <img src="/images/m_coin.png" />
              MOC
            </div>
          </div>
          <div className="p-[23px] ml-[-2px]">
            <MocWallet.Util.WithdrawForm />
            <MocWallet.Util.Withdraw />
          </div>
        </div>
      </div> */}
    </div>
  );
}
