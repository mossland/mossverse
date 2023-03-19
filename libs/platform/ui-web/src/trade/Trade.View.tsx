import { gql, st, slice, useLocale } from "@platform/data-access";
import { RecentTime } from "@shared/ui-web";
import Image from "next/image";
import Router from "next/router";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TradeViewProps {
  className?: string;
  trade: gql.Trade;
  slice?: slice.TradeSlice;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const TradeView = ({ className, trade, slice = st.slice.trade }: TradeViewProps) => {
  const { l } = useLocale();
  return (
    <div className={twMerge(className, ``)}>
      <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
        <h3>
          {l("trade.id")}-{trade.id}
        </h3>
      </div>
      <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
        <div>{trade.status}</div>
        <RecentTime date={trade.createdAt} breakUnit="second" timeOption={{ dateStyle: "short", timeStyle: "short" }} />
      </div>
    </div>
  );
};

interface TradeViewInMarketProps {
  trade: gql.Trade | gql.LightTrade;
  slice?: slice.TradeSlice;
  actions?: ReactNode;
}

export const TradeViewInMarket = ({ trade, slice = st.slice.trade, actions }: TradeViewInMarketProps) => {
  const { l } = useLocale();
  return (
    <div>
      <div className="flex items-center justify-center w-full mt-5">
        <Image
          className="rounded-md shadow-md"
          alt="trade"
          width={324}
          height={324}
          src={trade.outputs[0].getImageUrl()}
        />
      </div>
      <hr className="mx-5 border-[0.5px] border-gray-300" />
      <div className="mb-8 z-[10] px-[20px] flex-1 relative overflow-auto">
        <div className="flex justify-between">
          <div>
            <div className="text-[24px] text-gray-500">상품명</div>
            <div className="text-[18px] text-black  ml-4"> {trade.outputs[0].getName()}</div>
          </div>
          {/* <div>
            {!!trade.outputs[0].value && (
              <div className="text-[17px] text-gray-500  ml-4">
                {trade.value} / {trade.totalValue()}
              </div>
            )}
          </div> */}
        </div>
        <div className="mt-4">
          <div className="text-[24px] text-gray-500">가격</div>
          <div className="relative ml-4 pl-[34px] w-100%">
            <Image
              alt="priceTag"
              width={30}
              height={20}
              className="absolute top-1/2 left-[6px] translate-x-0 translate-y-[-50%] w-[20px]"
              src={trade.inputs[0].getImageUrl()}
            />
            <div className="flex">
              {trade.inputs?.[0].value}&nbsp;{trade.inputs[0].getName()}
            </div>
          </div>
        </div>
      </div>
      {trade.description && (
        <>
          <div className="mt-4 text-[24px] text-gray-500">설명</div>
          <div className="text-[18px] text-black ml-4">{trade.description}</div>
        </>
      )}
      {actions}
    </div>
  );
};

TradeView.InMarket = TradeViewInMarket;
