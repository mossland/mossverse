import React from "react";
import styled from "styled-components";
import { DefaultButton } from "@platform/ui-web";
import { BiDownArrowAlt } from "react-icons/bi";

type MocToMmocStep2 = {
  onClick: () => void;
};

export const MocToMmocStep2 = ({ onClick }: MocToMmocStep2) => {
  return (
    <MocToMmocStep2Container>
      <h3>
        Send only MOC to this
        <br />
        deposit address.
      </h3>
      <p>
        Sending any other asset, will
        <br />
        result permanent loss
      </p>
      <img src="/images/bank.svg" />
      <DefaultButton onClick={onClick} block type="primary">
        I understand
      </DefaultButton>
    </MocToMmocStep2Container>
  );
};

const MocToMmocStep2Container = styled.div`
  padding: 44px 23px;
  border-bottom: 2px solid ${(props) => props.theme.color.black};
  line-height: 1em;
  text-align: center;
  p {
    font-size: 20px;
    line-height: 1.2em;
  }
  h3 {
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 14px;
    line-height: 1.1em;
  }
  img {
    display: block;
    text-align: center;
    margin: 25px auto;
  }
`;
