import React, { ReactNode } from "react";
import Link from "next/link";
import { Props } from "@shared/ui-web";

export const MocSurveyList = ({ children, className }: Props.BaseProps) => {
  return <div className={`flex-1 overflow-y-auto relative ${className}`}>{children}</div>;
};
