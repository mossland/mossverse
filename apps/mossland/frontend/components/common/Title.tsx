import React, { ReactNode } from "react";
import styled, { CSSProp } from "styled-components";

type TitleProps = {
  children: ReactNode;
  customStyle?: CSSProp;
};

export const Title = ({ children, customStyle }: TitleProps) => {
  return <H1 customStyle={customStyle ?? undefined}>{children}</H1>;
};

const H1 = styled.h1<TitleProps>`
  width: 50%;
  font-family: Ubuntu Mono;
  font-weight: 700;
  font-size: 26px;
  line-height: 1em;
  color: #000000;
  border-width: 10px;

  margin-bottom: 20px;
  ${({ customStyle }) => customStyle && customStyle};
`;
