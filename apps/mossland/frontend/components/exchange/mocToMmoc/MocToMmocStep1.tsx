import React from "react";
import styled from "styled-components";
import { DefaultButton } from "@platform/ui-web";
import { BiDownArrowAlt } from "react-icons/bi";

type MocToMMocStep1Type = {
  onClick: () => void;
  isDisabled: boolean;
};
export const MocToMmocStep1 = ({ onClick, isDisabled }: MocToMMocStep1Type) => {
  return (
    <MocToMmocStep1Container>
      <p>No MOC deposit addresses have been applied for before. Please retrieve the deposit address.</p>
      <img src="/images/qr_icon.svg" />
      <DefaultButton disabled={isDisabled} onClick={onClick} block type="primary">
        <BiDownArrowAlt />
        Get Address
      </DefaultButton>
    </MocToMmocStep1Container>
  );
};

const MocToMmocStep1Container = styled.div`
  padding: 23px 23px;
  border-bottom: 2px solid ${(props) => props.theme.color.black};
  p {
    font-size: 22px;
    line-height: 1em;
  }
  img {
    display: block;
    text-align: center;
    margin: 43px auto;
  }
`;
