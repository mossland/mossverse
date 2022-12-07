import React, { ReactNode } from "react";
import Link from "next/link";
import { Props } from "@shared/ui-web";

type BaseProps = {
  selected?: boolean;
  active?: boolean;
  children: ReactNode;
  className?: string;
};

type MocSurveyItemProps = BaseProps & {
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

export const MocSurveyItem = ({ selected, active, children, className, onClick }: MocSurveyItemProps) => {
  return (
    <button
      className={`relative mt-[-2px] flex justify-between p-[18px] h-[92px] w-full   border-t-2 border-b-2 border-solid 
      transition duration-500
      ${!active ? "bg-[#E8E8E8]" : "bg-white"}
      ${selected ? "border-[#000] z-[10]" : "border-[#9a9a9a] z-[0]"};
      ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
const TitleWrapper = ({ children, className }: Props.BaseProps) => {
  return <div className={`flex ${className}`}>{children}</div>;
};
const SubTitleWrapper = ({ children, className }: Props.BaseProps) => {
  return <div className={`flex items-end ${className}`}>{children}</div>;
};
const Title = ({ selected, active, children, className }: BaseProps) => {
  return (
    <div
      className={`ml-[8px] text-left not-italic text-[16px] leading-4
  ${selected ? "font-bold text-[#000]" : "font-normal text-[#555]"}
  ${className}`}
    >
      {children}
    </div>
  );
};
const Period = ({ children, className }: Props.BaseProps) => {
  return <div className={`text-end notitalic justify-end text-[16px] leading-4${className}`}>{children}</div>;
};
MocSurveyItem.Title = Title;
MocSurveyItem.Period = Period;
MocSurveyItem.TitleWrapper = TitleWrapper;
MocSurveyItem.SubTitleWrapper = SubTitleWrapper;
