import React, { ReactNode } from "react";
import Link from "next/link";
import { Props } from "@shared/ui-web";

export const MocSurveyFilter = ({ children, className }: Props.BaseProps) => {
  return <div className={`flex absolute bottom-[14px] ${className}`}>{children}</div>;
};

const Button = ({ children, className, onClick, disabled }: Props.ButtonProps) => {
  return (
    <button
      className={`flex text-center w-[110px] h-[26px] justify-center border-[1px] border-solid border-black mr-2 rounded-[6px] px-[16px] py-[8px] text-[14px] font-bold leading-[8px] ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

MocSurveyFilter.Button = Button;
