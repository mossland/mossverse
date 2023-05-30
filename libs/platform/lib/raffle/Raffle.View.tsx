import { ReactNode } from "react";
import { RecentTime } from "@shared/client";
import { fetch, usePage } from "@platform/client";
import { twMerge } from "tailwind-merge";

interface GeneralProps {
  className?: string;
  raffle: fetch.Raffle;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const General = ({ className, raffle }: GeneralProps) => {
  const { l } = usePage();
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

interface SelfProps {
  raffle: fetch.LightRaffle;
  userId?: string;
  className?: string;
  actions?: ReactNode;
}

export const Self = ({ className, userId, raffle }: SelfProps) => {
  const { l } = usePage();
  return (
    <div className="md:block">
      <div className=" p-[10px]">
        <div className="md:block text-center w-full text-[30px] mb-5 text-black font-bold">{raffle.getName()}</div>
        <div className="block md:justify-center md:items-center md:flex">
          <div className="w-full h-[324px] flex item-center justify-center">
            <img className="" src={raffle.getImageUrl()} />
          </div>
          <div className="w-full my-[60px] md:my-0 md:h-full ">
            {raffle.status === "raffling" ? (
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
            ) : raffle.status === "raffled" ? (
              <div className="flex text-[18px] text-black items-center justify-center w-full h-full font-bold text-center ">
                래플에 참여하지 않았습니다
              </div>
            ) : raffle.status === "closed" ? (
              raffle.isPicked(userId) ? (
                <div className="text-[18px] text-black w-full h-full  text-center ">
                  <div className="flex text-[26px] text-black items-center justify-center w-full h-full font-bold text-center ">
                    축하합니다!
                  </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};
