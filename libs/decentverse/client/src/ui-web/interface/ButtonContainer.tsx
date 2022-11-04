import { useEffect } from "react";
import styled from "styled-components";
import { Socket as Soc } from "socket.io-client";
import { MyProfileButton, Inventory, MyProfileBalance, ItemInfo, ProfileModal, AddWallet } from "./index";

export type ButtonContainerProps = {
  socket: Soc;
};

export const ButtonContainer = ({ socket }: ButtonContainerProps) => {
  return (
    <>
      <Container>
        <div className="left">
          <MyProfileButton />
          <MyProfileBalance />
        </div>
        <div className="right">
          <ItemInfo />
          <Inventory socket={socket} />
        </div>
      </Container>
      <ProfileModal />
      <AddWallet />
    </>
  );
};
const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  top: 16px;
  left: 10px;
  right: 10px;
  z-index: 1;
  .left {
    display: flex;
    /* flex-direction: ; */
  }
  .right {
    display: flex;
  }
`;
