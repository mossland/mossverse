import React, { ReactNode } from "react";
import Link from "next/link";
import { Props } from "@shared/ui-web";

export const MocSurveyCreateButton = ({ children, className, onClick, disabled }: Props.ButtonProps) => {
  return (
    <button
      className={`absolute right-0 mx-0 bottom-[10px] w-1/2 py-[23px] max-md:w-full text-center rounded-[6px] border-2 border-solid border-black bg-[#FFE177] text-[22px] leading-5 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
