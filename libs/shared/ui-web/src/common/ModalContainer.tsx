import React, { ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import { BiX } from "react-icons/bi";
import { WindowHeader } from "./";

type ModalContainerProps = {
  showModal: boolean;
  closeShowModal: () => void;
  title: string;
  children: ReactNode;
  isWide?: boolean;
  opacity?: string;
  onOk?: () => void;
};

export const ModalContainer = ({
  showModal,
  closeShowModal,
  title,
  children,
  onOk,
  opacity = "0.3",
  isWide = false,
}: ModalContainerProps) => {
  if (!showModal) return null;

  return (
    <>
      <ModalBackground />
      <Modal isWide={isWide} opacity={opacity} className="modal">
        <WindowHeader title={title} close={closeShowModal} />
        <div className="body">{children}</div>
      </Modal>
    </>
  );
};

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  left: 0;
  top: 0;

  background-color: black;
  opacity: 0.4;
  z-index: 1;
`;

const Modal = styled.div<{ isWide: boolean; opacity: string }>`
  z-index: 2;
  position: absolute;
  color: black;
  width: ${(props) => (props.isWide ? "810px" : "370px")};
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* min-height: 50%; */
  /* min-width: 400px; */
  /* min-height: 300px; */
  /* background: rgba(255, 255, 255, 0.3); */
  background: ${(props) => `rgba(255, 255, 255, ${props.opacity})`};

  backdrop-filter: blur(20px);
  border-radius: 10px;
  border: 3px solid #000;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
  .body {
    overflow-y: hidden;
    border-radius: 0 0 10px 10px;
  }

  @media screen and (max-width: 800px) {
    width: 90%;
    min-width: auto;
  }
`;
