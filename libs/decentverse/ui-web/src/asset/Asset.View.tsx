import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { RecentTime } from "@shared/ui-web";
import Router from "next/router";
import { twMerge } from "tailwind-merge";

interface AssetViewProps {
  className?: string;
  asset: gql.Asset;
  slice?: slice.AssetSlice;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const AssetView = ({ className, asset, slice = st.slice.asset }: AssetViewProps) => {
  const { l } = useLocale();
  return (
    <div className={twMerge(className, ``)}>
      <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
        <h3>{l("asset.id")}-{asset.id}</h3>
      </div>
      <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
        <div>{asset.status}</div>
        <RecentTime
          date={asset.createdAt}
          breakUnit="second"
          timeOption={{ dateStyle: "short", timeStyle: "short" }}
        />
      </div>
    </div>
  );
};
