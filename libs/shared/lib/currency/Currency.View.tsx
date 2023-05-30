"use client";
import { RecentTime, fetch, usePage } from "@shared/client";
import { twMerge } from "tailwind-merge";

interface CurrencyViewProps {
  className?: string;
  currency: fetch.Currency;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const General = ({ className, currency }: CurrencyViewProps) => {
  const { l } = usePage();
  return (
    <div className={twMerge(className, ``)}>
      <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
        <h3>
          {l("currency.id")}-{currency.id}
        </h3>
      </div>
      <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
        <div>{currency.status}</div>
        <RecentTime
          date={currency.createdAt}
          breakUnit="second"
          timeOption={{ dateStyle: "short", timeStyle: "short" }}
        />
      </div>
    </div>
  );
};
