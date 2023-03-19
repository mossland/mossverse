import { st, gql, slice, useLocale } from "@platform/data-access";
import { DataItem } from "@shared/ui-web";
import { ModelProps, useInterval } from "@shared/util-client";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { twMerge } from "tailwind-merge";

export const RaffleItem = ({
  className,
  raffle,
  slice = st.slice.raffle,
  actions,
  columns,
}: ModelProps<slice.RaffleSlice, gql.LightRaffle>) => {
  const { l } = useLocale();
  return (
    // <div>
    //   <Image alt="raffle" width={324} height={324} src={raffle.getImageUrl()}></Image>
    //   <div>래플 이름:{raffle.getName()}</div>
    //   <div>
    //     {l("raffle.closeAt")}:{raffle.closeAt.format("YYYY-MM-DD a hh:mm:ss")}
    //   </div>
    //   <div>
    //     {l("raffle.announceAt")}:{raffle.announceAt.format("YYYY-MM-DD a hh:mm:ss")}
    //   </div>
    //   <div>
    //     {l("raffle.entryLimit")}:{raffle.entryLimit}
    //   </div>
    //   <div>
    //     {l("raffle.status")}:{raffle.status}
    //   </div>
    //   <div>
    //     {actions?.map((action) => {
    //       return (
    //         <Button
    //           className={twMerge(
    //             "text-[#333333] text-[14px] font-bold border-[1px] border-[#333333] rounded-[4px] px-[10px] py-[5px] mr-[10px]"
    //           )}
    //         >
    //           {action}
    //         </Button>
    //       );
    //     })}
    //   </div>
    // </div>
    <DataItem
      // className={className}
      cover={<Image alt="raffle" width={324} height={324} src={raffle.getImageUrl()} />}
      title={`${raffle.getName()}`}
      model={raffle}
      slice={slice}
      actions={actions}
      columns={columns}
    />
  );
};

interface RaffleItemInSelfProps {
  raffle: gql.Raffle;
  self: gql.User;
  onClick: () => void;
  slice?: slice.RaffleSlice;
  actions?: ReactNode;
}

export const RaffleItemInSelf = ({
  slice = st.slice.raffle,
  self,
  actions,
  raffle,
  onClick,
}: RaffleItemInSelfProps) => {
  const [remainTime, setRemainTime] = useState("");

  useInterval(() => {
    setRemainTime(raffle.getRemainCloseTime());
  }, 1000);

  useEffect(() => {
    setRemainTime(raffle.getRemainCloseTime());
  }, []);

  return (
    <div className="flex w-full  mt-[20px]">
      <div className="flex flex-1 md:w-[176px]  w-[180px] ">
        <img className="w-full h-full" src={raffle.getImageUrl()} />
      </div>
      <div className="pl-[15px] flex-1  gap-x-[10px] items-start justify-start w-full h-full text-start">
        <div className="text-[19px] text-black font-bold">{raffle.getName()}</div>
        {raffle.status === "raffling" ? (
          <div className="text-[14px] text-red-600">{remainTime} 남음</div>
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
        <div>
          <button
            className="btn btn-ghost gap-2 flex text-[12px] text-gray-500  pl-0 hover:opacity-50"
            onClick={onClick}
            // onClick={async () => {
            //   if (raffle.status === "closed" && raffle.isPicked(self) && raffle.product) {
            //     await st.do.openMyShipInfo(self, raffle.product);
            //   }
            //   await slice.do.viewRaffle(raffle as gql.platform.Raffle);
            // }}
          >
            자세히보기
            <BiChevronRight className="text-[12px] md:text-[16px]" />
          </button>
        </div>
        {actions}
      </div>
    </div>
  );
};

RaffleItem.InSelf = RaffleItemInSelf;
