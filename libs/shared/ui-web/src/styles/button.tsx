import { Types } from "libs/shared/ui-web/src";
import { darken } from "polished";
import styled, { CSSProp, StyledComponent, StyledComponentBase } from "styled-components";

export const Container = styled.button<Types.UiWebButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  border-radius: 6px;
  border: 1px solid;
  font-family: Ubuntu Mono;
  font-style: normal;
  font-weight: 700;
  line-height: 12px;
  font-size: 14px;
  transition: all 0.5s;
  padding: 8px 16px;
  background-color: ${(props) => props.backgroundColor ?? props.theme.color.white};
  border: 2px solid ${(props) => props.theme.color.black};
  cursor: pointer;
  &:hover,
  &:active {
    background-color: ${(props) => darken(0.1, props.backgroundColor ?? props.theme.color.white)};
  }
  &:disabled {
    background-color: ${(props) => darken(0.3, props.theme.color.white)};
    border-color: #777777;
    color: #777777;
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
