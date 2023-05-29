"use client";
import { Overlay } from "../../client";
import { fetch } from "@decentverse/client";

interface CallRoomViewProps {
  className?: string;
  callRoom: fetch.CallRoom;
}
export const CallRoomView = ({ className, callRoom }: CallRoomViewProps) => {
  return <Overlay center={callRoom.center} wh={callRoom.wh} />;
};
