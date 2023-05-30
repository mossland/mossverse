import { DataItem, Image } from "@shared/client";
import { ModelProps } from "@util/client";
import { Raffle, fetch, usePage } from "@platform/client";

export const Admin = ({
  className,
  raffle,
  sliceName = "raffle",
  actions,
  columns,
}: ModelProps<"raffle", fetch.LightRaffle>) => {
  const { l } = usePage();
  return (
    <DataItem
      className={className}
      cover={<Image width={324} height={324} src={raffle.getImageUrl()} />}
      title={`${raffle.getName()}`}
      model={raffle}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};

interface SelfProps {
  raffle: fetch.LightRaffle;
  userId?: string;
}

export const Self = ({ raffle, userId }: SelfProps) => {
  return (
    <div className="flex w-full  mt-[20px]">
      <div className="flex flex-1 md:w-[176px]  w-[180px] ">
        <img className="w-full h-full" src={raffle.getImageUrl()} />
      </div>
      <div className="pl-[15px] flex-1  gap-x-[10px] items-start justify-start w-full h-full text-start">
        <div className="text-[19px] text-black font-bold">{raffle.getName()}</div>
        {raffle.status === "raffling" ? (
          <div className="text-[14px] text-red-600">{raffle.getRemainCloseTime()} 남음</div>
        ) : (
          <div className="text-[14px] text-red-600">응모 종료</div>
        )}
        {raffle.status !== "raffled" && (
          <div className="flex text-[14px] font-bold text-black">
            {raffle.priceTags?.[0]?.thing && (
              <>
                {/* <img className="w-8 h-8 mr-2 " src={raffle.priceTags?.[0].thing?.image.url} /> */}
                {raffle.priceTags?.[0].price}&nbsp;
                {raffle.priceTags?.[0].thing?.name}
              </>
            )}
            {raffle.priceTags?.[0]?.token && (
              <>
                {/* <img className="w-8 h-8 mr-2 " src={raffle.priceTags?.[0].token?.image?.url} /> */}
                {raffle.priceTags?.[0].price}&nbsp;
                {raffle.priceTags?.[0].token.meta?.name}
              </>
            )}
            &nbsp;필요
          </div>
        )}
        <div className="text-[14px] font-bold text-black">{raffle.entries.length}명 참여</div>

        <Raffle.Util.ShipInfo raffleId={raffle.id} status={raffle.status} />
      </div>
    </div>
  );
};
