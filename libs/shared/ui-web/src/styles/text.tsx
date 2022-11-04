import { Types } from "libs/shared/ui-web/src";
import styled, { CSSProp, StyledComponent, StyledComponentBase } from "styled-components";

export const Container = styled.div<Types.UiWebTextProps>`
  font-size: 14px;
  font-weight: 400;
  font-family: Ubuntu Mono;
  line-height: 1em;
  ${({ customStyle }) => customStyle && customStyle};
`;
