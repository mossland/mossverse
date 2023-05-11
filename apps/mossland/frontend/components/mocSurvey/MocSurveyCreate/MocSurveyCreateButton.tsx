import React, { ReactNode } from "react";
import Link from "next/link";
import { Props } from "@shared/ui-web";

export const MocSurveyCreateButton = ({ children, className, onClick, disabled }: Props.ButtonProps) => {
  return (
    <div className="absolute right-0 bottom-0 flex items-center justify-center w-full md:mx-[20px] md:w-[47%] mb-[10px]">
      <button
        className={`py-[23px] w-[95%] text-center rounded-[6px] border-2 border-solid border-black bg-[#FFE177] text-[22px] leading-5 ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
};
