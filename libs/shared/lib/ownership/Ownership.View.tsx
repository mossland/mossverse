"use client";
import { Image, RecentTime, fetch, st, usePage } from "@shared/client";
import { ReactNode } from "react";
import { Utils, cnst } from "@util/client";
import { twMerge } from "tailwind-merge";

interface OwnershipViewProps {
  className?: string;
  ownership: fetch.Ownership;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const General = ({ className, ownership }: OwnershipViewProps) => {
  const { l } = usePage();
  return (
    <div className={twMerge(className, ``)}>
      <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
        <h3>
          {l("ownership.id")}-{ownership.id}
        </h3>
      </div>
      <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
        <div>{ownership.status}</div>
        <RecentTime
          date={ownership.createdAt}
          breakUnit="second"
          timeOption={{ dateStyle: "short", timeStyle: "short" }}
        />
      </div>
    </div>
  );
};

interface OwnershipViewInSelfProps {
  ownership: fetch.Ownership;
  className?: string;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const InSelf = ({ className, ownership }: OwnershipViewInSelfProps) => {
  const { l } = usePage();
  return (
    <div className={twMerge("p-2 mt-4 mb-0 text-2xl border-gray-200 ", className)}>
      <div className="flex items-center justify-center w-full ">
        <Image className="rounded-md shadow-md" width={324} height={324} src={ownership.getImageUrl()} />
      </div>
      <div className="text-[24px] text-gray-500">상품명</div>
      <div className="text-[18px] ml-4"> {ownership.getName()}</div>
    </div>
  );
};

interface OwnershipViewStockProps {
  self: fetch.User;
  name: string;
  type: cnst.OwnershipType;
  className?: string;
  actions?: ReactNode;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const ViewStock = ({ className, self, name, type, actions }: OwnershipViewStockProps) => {
  const { l } = usePage();
  const ownershipMap = st.use.ownershipMap();
  const ownership = ownershipMap !== "loading" ? fetch.Ownership.getByName([...ownershipMap.values()], name) : null;
  const tokenMap = st.use.tokenMap();
  const thingMap = st.use.thingMap();
  const stock =
    type === "token" && tokenMap !== "loading"
      ? fetch.Token.findByName([...tokenMap.values()], name)
      : type === "thing" && thingMap !== "loading"
      ? fetch.Thing.findByName([...thingMap.values()], name)
      : null;
  return (
    <div>
      {!ownership ? (
        !stock ? (
          <></>
        ) : (
          <div className="text-white text-[26px] leading-[1.1em]" style={{ textShadow: "0px 2px 0 #000" }}>
            <div className="text-[22px]">
              <img className="w-[24px] h-[24px] mr-[4px] " src={stock.getImageUrl()} />0
            </div>
          </div>
        )
      ) : (
        <div className="text-white text-[26px] leading-[1.1em]" style={{ textShadow: "0px 2px 0 #000" }}>
          <div className="text-[22px]">
            <img className="w-[24px] h-[24px] mr-[4px] " src={ownership.getImageUrl()} />
            {ownership.value ? Utils.numberWithCommas(ownership.value) : 0}
          </div>
        </div>
      )}
    </div>
  );
};
