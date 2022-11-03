import { MutableRefObject } from "react";
import { types } from "../../stores";
import { useKeyboard, useGameConnection, useWindowDimensions } from "../../hooks";
import { Socket as Soc } from "socket.io-client";

export interface StateManagementProps {
  socket: Soc;
  keyState: MutableRefObject<types.Keyboard>;
  lockState: MutableRefObject<boolean>;
  scope: MutableRefObject<types.WorldScope>;
  player: MutableRefObject<types.RenderCharacter>;
  eventCallback?: types.EventCallback;
}

export const StateManagement = ({
  socket,
  keyState,
  lockState,
  scope,
  player,
  eventCallback,
}: StateManagementProps) => {
  useKeyboard({ keyState, lockState });
  useGameConnection({ player, scope, socket, eventCallback });
  useWindowDimensions();
  return <div></div>;
};
