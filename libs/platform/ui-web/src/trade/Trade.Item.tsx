import { st, gql, slice, useLocale } from "@platform/data-access";
import { DataItem } from "@shared/ui-web";
import { ModelProps } from "@shared/util-client";
import Image from "next/image";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const TradeItem = ({
  className,
  trade,
  slice = st.slice.trade,
  actions,
  columns,
}: ModelProps<slice.TradeSlice, gql.LightTrade>) => {
  return (
    <DataItem
      className={className}
      title={`${trade.id}-${trade.name}`}
      model={trade}
      slice={slice}
      actions={actions}
      columns={columns}
    />
  );
};

interface TradeItemInMarketProps {
  trade: gql.Trade | gql.LightTrade;
  onClick: (item: gql.Trade | gql.LightTrade) => any;
  actions?: ReactNode;
  slice?: slice.TradeSlice;
}

export const TradeItemInMarket = ({ trade, slice = st.slice.trade, actions, onClick }: TradeItemInMarketProps) => {
  const src = trade.inputs[0].thing?.image.url;
  const money = trade.outputs[0].thing?.image.url;
  return (
    <button className="w-full bg-transparent hover:opacity-50" onClick={async () => await onClick(trade)}>
      <div className="flex items-center justify-center overflow-hidden bg-gray-50 rounded-t-md aspect-1">
        <div className=" w-full h-full flex  rounded-t-md border-[0.5px] border-gray-100">
          {src ? (
            <Image
              alt="trade"
              width={324}
              height={324}
              className={`w-full h-full rounded-t-[5px]`}
              src={trade.outputs[0].getImageUrl()}
            />
          ) : (
            <div className="flex w-[324px] items-center justify-center">no image</div>
          )}
        </div>
      </div>
      <div className={`p-[2px] rounded-b-md shadow-md releative`}>
        <div className={`text-[18px] text-black ml-[10px] font-bold mb-[4px] text-start `}>{trade.name}</div>
        <div className="text-[14px] mx-2 flex font-bold justify-between">
          <div className="text-[14px]  flex font-bold text-black">
            <img className="w-5 h-5 mr-2" src={trade.inputs[0].getImageUrl()} />
            <div className={`text-[14px] flex font-bold text-black `}>{trade.inputs[0].value}</div>
            {/* <div className="text-[14px] flex font-bold text-black">{trade.priceTags[0].discountPrice}</div> */}
          </div>
          {/* {!!trade.value && (
            <>
              {trade.value}/{trade.totalValue()}
            </>
          )} */}
        </div>
      </div>
    </button>
  );
};

TradeItem.InMarket = TradeItemInMarket;
