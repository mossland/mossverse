import React, { ReactNode } from "react";
import styled from "styled-components";

type PageTitleProps = {
  children: ReactNode;
};

export const PageTitle = ({ children }: PageTitleProps) => {
  return <H1>{children}</H1>;
};

const H1 = styled.h1`
  font-weight: 700;
  font-size: 26px;
  line-height: 26px;
  color: #000000;
  border-width: 10px;
  margin-bottom: 20px;
`;
