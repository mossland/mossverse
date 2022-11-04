import { Types } from "libs/shared/ui-web/src";
import styled, { CSSProp, StyledComponent, StyledComponentBase } from "styled-components";

export const Container = styled.div<Types.UiWebTextProps>`
  font-size: 26px;
  font-weight: 700;
  font-family: Ubuntu Mono;
  line-height: 1em;
  ${({ customStyle }) => customStyle && customStyle};
`;
