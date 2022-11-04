import { Types } from "libs/shared/ui-web/src";
import { type } from "os";
import { darken } from "polished";
import React, { ReactNode } from "react";
import styled, { CSSProp, StyledComponent, StyledComponentBase } from "styled-components";

export const Desc = <T,>(props: Types.UiWebTextProps & T) => {
  return (
    <H1 {...props} ref={null}>
      {props.children}
    </H1>
  );
};

export const Image = <T,>(props: Types.UiWebImageProps & T) => {
  return (
    <Img {...props} ref={null}>
      {props.children}
    </Img>
  );
};

const H1 = styled.h1<Types.UiWebTextProps>`
  ${({ customStyle }) => customStyle && customStyle};
`;

const Img = styled.img<Types.UiWebImageProps>`
  ${({ customStyle }) => customStyle && customStyle};
`;
