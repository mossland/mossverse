import React, { ReactNode } from "react";

type PageHeaderProps = {
  children: ReactNode;
};

export const PageHeader = ({ children }: PageHeaderProps) => {
  return <div className="border-b-4 flex justify-between items-baseline">{children}</div>;
};
