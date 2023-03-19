import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { RecentTime } from "@shared/ui-web";
import Router from "next/router";
import { twMerge } from "tailwind-merge";

interface TeleportViewProps {
  className?: string;
  teleport: gql.Teleport;
  slice?: slice.TeleportSlice;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const TeleportView = ({ className, teleport, slice = st.slice.teleport }: TeleportViewProps) => {
  const { l } = useLocale();
  return <div className={twMerge(className, ``)}></div>;
};
