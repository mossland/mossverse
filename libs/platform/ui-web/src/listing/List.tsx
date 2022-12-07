import React, { ReactNode } from "react";
import { StyledEmptyList, StyledList } from "./styles";

type EmptyListProps = {
  children: ReactNode;
};

export const EmptyList = ({ children }: EmptyListProps) => {
  return <StyledEmptyList>{children}</StyledEmptyList>;
};

type ListProps = {
  children: ReactNode;
};

export const List = ({ children }: ListProps) => {
  return <StyledList>{children}</StyledList>;
};
