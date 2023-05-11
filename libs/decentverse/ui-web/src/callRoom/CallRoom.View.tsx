import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { useInterval } from "@shared/util-client";
import { useEffect } from "react";
import { Overlay } from "../common/Overlay";

interface CallRoomViewProps {
  className?: string;
  callRoom: gql.CallRoom;
  slice?: slice.CallRoomSlice;
}
export const CallRoomView = ({ className, callRoom, slice = st.slice.callRoom }: CallRoomViewProps) => {
  return <Overlay center={callRoom.center} wh={callRoom.wh} />;
};
