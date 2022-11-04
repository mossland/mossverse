import { Types } from "libs/shared/ui-web/src";
import { darken } from "polished";
import styled, { CSSProp, StyledComponent, StyledComponentBase } from "styled-components";

export const Container = styled.input<Types.UiWebNumberInputProps>`
  padding: 4px 11px;
  font-size: 16px;
  /* height: 30px; */
  border-radius: 6px;
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  transition: all 0.5s;
  &:focus {
    border-color: #40a9ff;
    outline: 0;

    /* box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2); */
  }
  &:hover {
    border-color: ${(props) => darken(0.1, "#40a9ff")};
  }
`;
