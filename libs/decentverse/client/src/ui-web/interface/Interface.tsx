import { Socket as Soc } from "socket.io-client";
import {
  Chatting,
  WebViewModal,
  MobileController,
  MicController,
  ButtonContainer,
  PlayerClickMenu,
  MediaSettingModal,
} from "./index";
import styled from "styled-components";

type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

interface IJoystickUpdateEvent {
  type: "move" | "stop" | "start";
  x: number | null;
  y: number | null;
  direction: JoystickDirection | null;
  distance: number | null;
}

export interface InterfaceProps {
  socket: Soc;
}

export const Interface = ({ socket }: InterfaceProps) => {
  return (
    <InterfaceContainer>
      <ChattingContainer>
        <Chatting socket={socket} />
      </ChattingContainer>
      <ButtonContainer socket={socket} />
      <PlayerClickMenu socket={socket} />
      <WebViewModal />
      <MobileController />
      <MicController />
    </InterfaceContainer>
  );
};

const InterfaceContainer = styled.div`
  z-index: 2;
`;
const ChattingContainer = styled.div`
  position: absolute;
  bottom: 0%;
  z-index: 2;
  align-items: center;
  flex-direction: column;
  display: flex;
  justify-content: center;
  width: 100%;
`;
