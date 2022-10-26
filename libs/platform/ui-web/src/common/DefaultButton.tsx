import React, { ReactNode } from "react";
import { DefaultButton as Button } from "@shared/ui-web";
import styled, { css } from "styled-components";
import { darken } from "polished";

type DefaultButtonProps = {
  children: ReactNode;
  onClick: () => void;
  block?: boolean;
  id?: string;
  type?: ButtonTypes;
  className?: string;
  disabled?: boolean;
};

type ButtonContainerProps = {
  block: boolean;
  type: ButtonTypes;
};

type ButtonTypes = "primary" | "default" | "warning";

export const DefaultButton = ({
  block,
  onClick,
  id,
  children,
  type,
  className,
  disabled = false,
}: DefaultButtonProps) => {
  return (
    <ButtonContainer block={block || false} type={type || "default"} className={className}>
      <Button id={id} onClick={onClick} children={children} disabled={disabled} />
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div<ButtonContainerProps>`
  ${(props) => props.block && "width: 100%"};

  button {
    min-height: 60px;
    padding: 13px;
    border-radius: 10px;
    border: 2px solid ${(props) => props.theme.color.black};
    font-weight: 400;
    font-size: 22px;
    line-height: 22px;
    transition: all 0.5s;
    cursor: pointer;
    ${(props) => props.block && "width: 100%"};

    &:hover,
    &:active {
      background-color: ${(props) => darken(0.1, props.theme.color.white)};
    }

    ${(props) => {
      let color = props.theme.color.white;
      let disabledColor = darken(0.3, props.theme.color.white);
      if (props.type === "primary") {
        color = props.theme.color.main;
        disabledColor = props.theme.color.main;
        // disabledColor = darken(0.3, props.theme.color.main);
      }
      if (props.type === "warning") {
        color = props.theme.color.yellow;
        disabledColor = darken(0.3, props.theme.color.yellow);
      }

      return css`
        background-color: ${color};
        &:hover,
        &:active {
          background-color: ${darken(0.2, color)};
        }
        &:disabled {
          background-color: ${disabledColor};
          border-color: #777777;
          color: #777777;
          opacity: 0.6;

          cursor: not-allowed;
        }
      `;
    }}
    svg {
      display: inline;
      margin-right: 4px;
      vertical-align: bottom;
    }
  }
`;
