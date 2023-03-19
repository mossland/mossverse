import React, { ReactNode } from "react";
import Link from "next/link";
import { Props } from "@shared/ui-web";

export const MocSurveyBody = ({ children, className }: Props.BaseProps) => {
  return (
    <div
      className={`flex overflow-y-auto p-[0px] h-[calc(100vh-101px)] border-t-2 border-solid border-black ${className}`}
    >
      {children}
    </div>
  );
};
