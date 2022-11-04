import React, { ReactNode } from "react";
import * as Style from "./MocSurveyHeader.style";
import Link from "next/link";

type BaseProps = {
  children: ReactNode;
  className?: string;
};

export const MocSurveyHeader = ({ children, className }: BaseProps) => {
  return <Style.HeaderContainer className={className}>{children}</Style.HeaderContainer>;
};

export const Title = ({ children, className }: BaseProps) => {
  return <Style.Title className={className}>{children}</Style.Title>;
};

export const TopField = ({ children, className }: BaseProps) => {
  return <Style.TopField className={className}>{children}</Style.TopField>;
};

export const Right = ({ children, className }: BaseProps) => {
  return <Style.Right className={className}>{children}</Style.Right>;
};

// export const MocSurveyHeader = ({ children, className }: BaseProps) => {
//   <Style.HeaderContainer>
//   <Style.TopField>
//     <Style.Title>Proposals</Style.Title>
//     <Style.Right className="right">{mocSurveyService.wallet ? <MyAddress /> : <Connect />}</Style.Right>
//   </Style.TopField>
//   <FilterButtons />
// </Style.HeaderContainer>
