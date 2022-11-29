import React, { ReactNode } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { DefaultButton } from "../common";
import styled from "styled-components";

// NavContainer
type NavContainerProps = {
  children: ReactNode;
};

export const NavContainer = ({ children }: NavContainerProps) => {
  return <StyledNavContainer>{children}</StyledNavContainer>;
};

const StyledNavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
`;

//NavItem
type NavItemProps = {
  menu: { id: string; label: string };
  onClick: (id: string) => void;
  checkIsActive: (id: string) => boolean;
};

export const NavItem = ({ menu, onClick, checkIsActive }: NavItemProps) => {
  return (
    <StyledNavItem className={`${checkIsActive(menu.id) && "active"}`} onClick={() => onClick(menu.id)}>
      {menu.label}
    </StyledNavItem>
  );
};

const StyledNavItem = styled.div`
  font-weight: bold;
  font-size: 20px;
  color: #777777;
  width: 33.33333%;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
  transition: 0.3s;
  height: 40px;

  &:hover,
  &.active {
    color: #000;
  }
`;
