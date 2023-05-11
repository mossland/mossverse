import { gql, st, slice, useLocale } from "@platform/data-access";
import { OnlyAdmin, RecentTime } from "@shared/ui-web";
import Router from "next/router";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ReceiptViewProps {
  className?: string;
  receipt: gql.Receipt;
  slice?: slice.ReceiptSlice;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const ReceiptView = ({ className, receipt, slice = st.slice.receipt }: ReceiptViewProps) => {
  const { l } = useLocale();
  return (
    <div className={twMerge(className, ``)}>
      <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
        <h3>
          {l("receipt.id")}-{receipt.id}
        </h3>
      </div>
      <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
        <div>{receipt.status}</div>
        <RecentTime
          date={receipt.createdAt}
          breakUnit="second"
          timeOption={{ dateStyle: "short", timeStyle: "short" }}
        />
      </div>
    </div>
  );
};
