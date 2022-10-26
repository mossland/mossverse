import React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { DefaultButton } from "../common";
import styled from "styled-components";

type MmocToMocButtonProps = {
  disabled: boolean;
  onClick: () => void;
};

export const MmocToMocButton = ({ disabled, onClick }: MmocToMocButtonProps) => {
  return (
    <MmocToMocButtonContainer disabled={disabled}>
      <DefaultButton block disabled={disabled} onClick={onClick} type="primary">
        MMOC <BiRightArrowAlt /> <img src="/images/m_coin.png" />
        MOC
      </DefaultButton>
    </MmocToMocButtonContainer>
  );
};

const MmocToMocButtonContainer = styled.div<{ disabled: boolean }>`
  button {
    background: linear-gradient(270deg, #23fae6 27.6%, rgba(102, 254, 240, 0.3) 100%);
    &:disabled {
      /* background: #aaa; */
      /* border-color: #999;
      color: #666; */
      opacity: 0.6;
      cursor: auto;
    }
  }

  img {
    width: 18px;
    height: 18px;
    vertical-align: baseline;
    display: inline-block;
    margin-bottom: -2px;
    margin-right: 4px;
  }
`;
