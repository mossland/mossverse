import { gql, st, slice, useLocale } from "@platform/data-access";
import { OnlyAdmin, RecentTime } from "@shared/ui-web";
import Router from "next/router";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface RaffleViewProps {
  className?: string;
  raffle: gql.Raffle;
  slice?: slice.RaffleSlice;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const RaffleView = ({ className, raffle, slice = st.slice.raffle }: RaffleViewProps) => {
  const { l } = useLocale();
  return (
    <div className={twMerge(className, ``)}>
      <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
        <h3>
          {l("raffle.id")}-{raffle.id}
        </h3>
      </div>
      <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
        <div>{raffle.status}</div>
        <RecentTime
          date={raffle.createdAt}
          breakUnit="second"
          timeOption={{ dateStyle: "short", timeStyle: "short" }}
        />
      </div>
    </div>
  );
};

interface RaffleViewInSelfProps {
  raffle: gql.Raffle;
  self: gql.User;
  className?: string;
  slice?: slice.RaffleSlice;
  actions?: ReactNode;
}

export const RaffleViewInSelf = ({
  className,
  self,
  raffle,
  actions,
  slice = st.slice.raffle,
}: RaffleViewInSelfProps) => {
  const { l } = useLocale();
  return (
    <div className=" md:block">
      <div className=" p-[10px]">
        <div className=" h-[324px] flex item-center justify-center">
          <img className="" src={raffle.getImageUrl()} />
        </div>
        <div className="ml-[30px]  ">
          <div className="md:block text-[30px] mt-5 text-black font-bold">{raffle.getName()}</div>
          <div className=" my-[60px] md:my-0 md:h-full ">
            <div>
              <div className="flex text-[24px] text-black">
                {raffle.priceTags?.[0]?.thing && (
                  <>
                    {/* <img className="w-8 h-8 mr-2" src={raffle.priceTags?.[0].thing?.image.url} /> */}
                    {raffle.priceTags?.[0].price}&nbsp;
                    {raffle.priceTags?.[0].thing?.name}
                  </>
                )}
                {raffle.priceTags?.[0]?.token && (
                  <>
                    {/* <img className="w-8 h-8 mr-2" src={raffle.priceTags?.[0].token?.image?.url} /> */}
                    {raffle.priceTags?.[0].price}&nbsp;
                    {raffle.priceTags?.[0].token.meta?.name}
                  </>
                )}{" "}
                필요
              </div>

              <div className="text-[18px] text-black mb-3">{raffle.entries.length}명 참여</div>
              <div className="mb-3">
                <div className="text-[18px] text-gray-500">응모 기간</div>
                <div className="text-[18px] text-black text-">
                  {raffle.createdAt.format("YYYY년 MM월 DD일 a hh:mm")}&nbsp;~
                  {/* {Utils.DateFormat(raffle.createdAt).format("YYYY년 MM월 DD일 a hh:mm")}&nbsp;~ */}
                  <br />
                  {raffle.closeAt.format("YYYY년 MM월 DD일 a hh:mm")}
                </div>
              </div>
              <div className="mb-3">
                <div className="text-[18px] text-gray-500">당첨자 발표</div>
                <div className="text-[18px] text-black">{raffle.announceAt.format("YYYY년 MM월 DD일 a hh:mm")}</div>
              </div>
              <div className="text-[18px] text-gray-500">당첨 인원</div>
              <div className="text-[18px] text-black">{raffle.totalRaffleNum}명</div>
            </div>
            {raffle.status === "raffled" ? (
              <div className="flex text-[18px] text-black items-center justify-center w-full h-full font-bold text-center ">
                래플에 참여하지 않았습니다
              </div>
            ) : raffle.status === "closed" ? (
              raffle.isPicked(self) ? (
                <div className="flex text-[18px] text-black items-center justify-center w-full h-full font-bold text-center ">
                  축하합니다!
                  <br />
                  {raffle.announceAt.format("YYYY년 MM월 DD일 a hh:mm")}까지
                  <br />
                  아래 내용을 입력해주세요.
                </div>
              ) : (
                <div className="flex text-[18px] text-black items-center justify-center w-full h-full font-bold text-center ">
                  래플이 종료되었습니다
                </div>
              )
            ) : null}
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
};

RaffleView.InSelf = RaffleViewInSelf;
