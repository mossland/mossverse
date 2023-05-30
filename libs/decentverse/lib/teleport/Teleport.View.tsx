"use client";
import { fetch, usePage } from "@decentverse/client";
import { twMerge } from "tailwind-merge";

interface GeneralProps {
  className?: string;
  teleport: fetch.Teleport;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const General = ({ className, teleport }: GeneralProps) => {
  const { l } = usePage();
  return <div className={twMerge(className, ``)}></div>;
};
