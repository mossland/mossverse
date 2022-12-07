import React, { ReactNode } from "react";
import Link from "next/link";
import { Props } from "@shared/ui-web";

export const MocSurveyDetailHeader = ({ children, className }: Props.BaseProps) => {
  return <div className={`px-[18px] py-[22px] ${className}`}>{children}</div>;
  // return <Style.MocSurveyDetailHeader className={className}>{children}</Style.MocSurveyDetailHeader>;
};

const TitleWrapper = ({ children, className }: Props.BaseProps) => {
  return <div className={`flex ${className}`}>{children}</div>;
};

const SubTitleWrapper = ({ children, className }: Props.BaseProps) => {
  return <div className={`flex items-center justify-end ${className}`}>{children}</div>;
};

const Title = ({ children, className }: Props.BaseProps) => {
  return <div className={`font-normal text-[24px] leading-6 ml-2 mb-[30px] ${className}`}>{children}</div>;
};

const Period = ({ children, className }: Props.BaseProps) => {
  return <div className={`font-normal text-end justify-end leading-4 text-[16px] ${className}`}>{children}</div>;
};

MocSurveyDetailHeader.TitleWrapper = TitleWrapper;
MocSurveyDetailHeader.SubTitleWrapper = SubTitleWrapper;
MocSurveyDetailHeader.Title = Title;
MocSurveyDetailHeader.Period = Period;
