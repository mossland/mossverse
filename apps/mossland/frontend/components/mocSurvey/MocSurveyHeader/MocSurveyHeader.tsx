import React, { ReactNode } from "react";
import Link from "next/link";
import { Props } from "@shared/ui-web";

export const MocSurveyHeader = ({ children, className }: Props.BaseProps) => {
  return <div className={`relative p-[20px] h-[101px] ${className}`}>{children}</div>;
};

const Title = ({ children, className }: Props.BaseProps) => {
  return <div className={`flex-1 font-bold text-[26px] leading-5 color-black border-0${className}`}>{children}</div>;
};

const TopField = ({ children, className }: Props.BaseProps) => {
  return <div className={`w-full flex items-start justify-center bg-red-500${className}`}>{children}</div>;
};

const Right = ({ children, className }: Props.BaseProps) => {
  return <div className={`flex-1 ${className}`}>{children}</div>;
};

MocSurveyHeader.Title = Title;
MocSurveyHeader.Right = Right;
MocSurveyHeader.TopField = TopField;
