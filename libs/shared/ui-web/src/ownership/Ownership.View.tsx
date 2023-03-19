import { gql, st, slice, useLocale } from "@shared/data-access";
import { RecentTime } from "@shared/ui-web";
import { cnst, Utils } from "@shared/util";
import Image from "next/image";
import Router from "next/router";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface OwnershipViewProps {
  className?: string;
  ownership: gql.Ownership;
  slice?: slice.OwnershipSlice;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const OwnershipView = ({ className, ownership, slice = st.slice.ownership }: OwnershipViewProps) => {
  const { l } = useLocale();
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
  ownership: gql.Ownership;
  self: gql.User;
  className?: string;
  slice?: slice.OwnershipSlice;
  actions?: ReactNode;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const OwnershipViewInSelf = ({
  className,
  self,
  ownership,
  slice = st.slice.ownership,
  actions,
}: OwnershipViewInSelfProps) => {
  const { l } = useLocale();
  return (
    <div className={twMerge(className, ``)}>
      <div className="p-2 mt-4 mb-0 text-2xl border-gray-200 ">
        <div className="flex items-center justify-center w-full ">
          <Image
            alt="ownership"
            className="rounded-md shadow-md"
            width={324}
            height={324}
            src={ownership.getImageUrl()}
          />
        </div>
        <div className="text-[24px] text-gray-500">상품명</div>
        <div className="text-[18px] ml-4"> {ownership.getName()}</div>
      </div>
      {actions}
    </div>
  );
};

interface OwnershipViewStockProps {
  self: gql.User;
  name: string;
  type: cnst.OwnershipType;
  className?: string;
  slice?: slice.OwnershipSlice;
  actions?: ReactNode;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const OwnershipViewStock = ({
  className,
  self,
  name,
  type,
  slice = st.slice.ownership,
  actions,
}: OwnershipViewStockProps) => {
  const { l } = useLocale();
  const ownershipList = slice.use.ownershipList();
  const ownership = ownershipList !== "loading" ? gql.Ownership.get(ownershipList, name) : null;
  const tokenList = st.use.tokenList();
  const thingList = st.use.thingList();
  const stock =
    type === "token" && tokenList !== "loading"
      ? gql.Token.findByName(tokenList, name)
      : type === "thing" && thingList !== "loading"
      ? gql.Thing.findByName(thingList, name)
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
        <div>
          <div className="text-white text-[26px] leading-[1.1em]" style={{ textShadow: "0px 2px 0 #000" }}>
            <div className="text-[22px]">
              <img className="w-[24px] h-[24px] mr-[4px] " src={ownership.getImageUrl()} />
              {ownership.value ? Utils.numberWithCommas(ownership.value) : 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

OwnershipView.InSelf = OwnershipViewInSelf;
OwnershipView.Stock = OwnershipViewStock;
