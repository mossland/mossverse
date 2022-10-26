import React, { ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import { BiX } from "react-icons/bi";
import { ReduceIcon } from "./";

type WindowHeaderProps = {
  title: string;
  close: () => void;
  type?: "close" | "reduce";
};

export const WindowHeader = ({ title, close, type = "close" }: WindowHeaderProps) => {
  return (
    <WindowHeaderContainer className="modal-header">
      <h2>{title}</h2>
      <div className="close-button" onClick={close}>
        {type === "close" ? <BiX className="bix" /> : <ReduceIcon />}
      </div>
    </WindowHeaderContainer>
  );
};

const WindowHeaderContainer = styled.div`
  position: relative;
  border-bottom: 2px solid #000;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.6);
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  overflow: hidden;
  text-align: center;
  h2 {
    font-size: 22px;
    margin: 0;
  }
  .close-button {
    height: 34px;
    position: absolute;
    width: 40px;
    right: 0;
    top: 0;
    /* background-color: rgba(255, 255, 255, 0.5); */
    border-left: 2px solid #000;
    cursor: pointer;
    svg.bix {
      font-size: 32px;
      margin: 2px auto 0;
    }
    .reduce {
      width: 18px;
      margin: 7px auto 0;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.8);
      transition: 0.5s;
    }
  }
`;
