import React, { ReactNode } from "react";
import styled from "styled-components";

type TitleProps = {
  children: ReactNode;
};

export const Title = ({ children }: TitleProps) => {
  return <H1>{children}</H1>;
};

const H1 = styled.h1`
  width: 50%;
  font-family: Ubuntu Mono;
  font-weight: 700;
  font-size: 26px;
  line-height: 1em;
  color: #000000;
  border-width: 10px;

  margin-bottom: 20px;
`;
