import React, { ReactNode, useEffect } from "react";
import styled from "styled-components";
import { Divider, Button } from "antd";
import { CheckIcon } from "@shared/ui-web";

type TagProps = {
  children: ReactNode;
  active: boolean;
  backgroundColor: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

export const SortButton = ({ children, active, backgroundColor, onClick }: TagProps) => {
  return (
    <Container active={active} backgroundColor={backgroundColor} onClick={onClick}>
      {active && <CheckIcon />}
      {children}
    </Container>
  );
};

const Container = styled.button<{ active: boolean; backgroundColor: string | "white" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  width: 102px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid;
  border-color: ${(props) => (props.active ? "black" : "gray")};
  color: ${(props) => (props.active ? "black" : "gray")};
  background-color: ${(props) => props.backgroundColor};
  font-family: Ubuntu Mono;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 12px;
  cursor: pointer;
  :hover {
    opacity: 0.5;
  }
`;
