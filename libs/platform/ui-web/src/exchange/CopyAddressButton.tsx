import React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { DefaultButton } from "../common";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BiCopyAlt } from "react-icons/bi";
import styled from "styled-components";
import { darken } from "polished";

type CopyAddressButtonProps = {
  address: string;
  onClick: (text: string) => void;
  type: "defaultButton" | "icon";
};

export const CopyAddressButton = ({ address, onClick, type }: CopyAddressButtonProps) => {
  if (type === "defaultButton") {
    return (
      <CopyToClipboard text={address} onCopy={(text: any) => onClick(text)}>
        <DefaultButton onClick={() => null} block type="primary">
          Copy Address
        </DefaultButton>
      </CopyToClipboard>
    );
  }

  return (
    <CopyToClipboard text={address} onCopy={(text: any) => onClick(text)}>
      <CopyButton>
        <BiCopyAlt />
      </CopyButton>
    </CopyToClipboard>
  );
};

const CopyButton = styled.div`
  background-color: ${(props) => props.theme.color.main};
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s;
  border-radius: 0 6px 6px 0;

  svg {
    font-size: 20px;
  }
  &:hover,
  &:active {
    background-color: ${(props) => darken(0.2, props.theme.color.main)};
  }
`;
