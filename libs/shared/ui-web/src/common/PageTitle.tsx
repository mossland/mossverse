import React, { ReactNode } from "react";

type PageTitleProps = {
  children: ReactNode;
};

export const PageTitle = ({ children }: PageTitleProps) => {
  return <h1 className={`text-3xl font-bold pt-10 leading-9 mb-2 inline-block pr-1 `}>{children}</h1>;
};
