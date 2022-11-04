import { MutableRefObject } from "react";
import { store, gql } from "@decentverse/data-access";
import { useKeyboard, useGameConnection, useWindowDimensions } from "../_hooks";
import { Socket as Soc } from "socket.io-client";

export interface StateManagementProps {
  socket: Soc;
  keyState: MutableRefObject<gql.Keyboard>;
  lockState: MutableRefObject<boolean>;
  scope: MutableRefObject<gql.WorldScope>;
  player: MutableRefObject<gql.RenderCharacter>;
}

export const StateManagement = ({ socket, keyState, lockState, scope, player }: StateManagementProps) => {
  useKeyboard({ keyState, lockState });
  useGameConnection({ player, scope, socket });
  useWindowDimensions();
  return <div></div>;
};
