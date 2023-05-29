import { DataItem, Image, Link } from "@shared/client";
import { ModelProps } from "@util/client";
import { fetch } from "@platform/client";

export const Admin = ({
  className,
  trade,
  sliceName = "trade",
  actions,
  columns,
}: ModelProps<"trade", fetch.LightTrade>) => {
  return (
    <DataItem
      className={className}
      title={`${trade.name}`}
      model={trade}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};

interface MarketProps {
  trade: fetch.Trade | fetch.LightTrade;
  href?: string;
}

export const Market = ({ trade, href }: MarketProps) => {
  const src = trade.inputs[0].thing?.image.url;
  const money = trade.outputs[0].thing?.image.url;
  return (
    <Link className="w-full bg-transparent hover:opacity-50" href={href}>
      <div className="flex items-center justify-center overflow-hidden bg-gray-50 rounded-t-md aspect-1">
        <div className=" w-full h-full flex  rounded-t-md border-[0.5px] border-gray-100">
          {src ? (
            <Image
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
    </Link>
  );
};

export const Abstract = ({ href, trade }: ModelProps<"trade", fetch.LightTrade>) => {
  return <></>;
};
