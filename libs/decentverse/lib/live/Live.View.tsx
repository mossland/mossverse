"use client";
import { RecentTime } from "@shared/client";
import { fetch, usePage } from "@decentverse/client";
import { twMerge } from "tailwind-merge";

interface GeneralProps {
  className?: string;
  live: fetch.Live;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const General = ({ className, live }: GeneralProps) => {
  const { l } = usePage();
  return (
    <div className={twMerge(className, ``)}>
      <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
        <h3>
          {l("live.id")}-{live.id}
        </h3>
      </div>
      <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
        <div>{live.status}</div>
        <RecentTime date={live.createdAt} breakUnit="second" timeOption={{ dateStyle: "short", timeStyle: "short" }} />
      </div>
    </div>
  );
};