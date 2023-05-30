"use client";
import * as CallRoom from "./_client";
import { LoadUnits } from "@shared/client";
import { ModelsProps, ServerInit, Utils, useInterval } from "@util/client";
import { Overlay } from "../../client";
import { fetch, st } from "@decentverse/client";
import { useEffect } from "react";

export const Admin = ({ sliceName = "callRoom", init }: ModelsProps<fetch.CallRoom>) => {
  const callRoomMap = st.use.callRoomMap();
  useEffect(() => {
    init && st.do.initCallRoom(init);
  }, [init]);
  return (
    <>
      {(callRoomMap === "loading" ? [] : [...callRoomMap.values()]).map((callRoom) => (
        <CallRoom.Unit.Admin key={callRoom.id} callRoom={callRoom} />
      ))}
    </>
  );
};

interface WorldProps {
  init: ServerInit<"callRoom", fetch.LightCallRoom>;
  onJoin?: (callRoom: fetch.CallRoom) => void;
  onLeave?: (callRoom: fetch.CallRoom) => void;
}
export const World = ({ init, onJoin, onLeave }: WorldProps) => {
  const callRoom = st.use.callRoom();
  const callRoomMap = st.use.callRoomMap();
  const playerPosition = st.ref((state) => state.playerPosition);
  const callRoomModal = st.use.callRoomModal();
  useInterval(() => {
    if (callRoomMap === "loading") return;
    if (callRoom !== "loading") {
      if (Utils.isInside(playerPosition.current, callRoom)) return;
      if (callRoomModal === "join") st.do.resetCallRoom();
    } else {
      for (const callRoom of [...callRoomMap.values()]) {
        if (!Utils.isInside(playerPosition.current, callRoom)) continue;
        st.do.viewCallRoom(callRoom.id, { modal: "join" });
      }
    }
  }, 200);
  useEffect(() => {
    if (callRoom === "loading" || callRoomModal !== "join") return;
    onJoin?.(callRoom);
    return () => {
      onLeave?.(callRoom);
    };
  }, [callRoom, onJoin, onLeave, callRoomModal]);
  return (
    <>
      <LoadUnits
        noDiv
        init={init}
        renderItem={(callRoom: fetch.LightCallRoom) => <CallRoom.Unit.World key={callRoom.id} callRoom={callRoom} />}
      />
      {callRoom === "loading" || callRoomModal !== "join" ? null : (
        <Overlay center={callRoom.center} wh={callRoom.wh} />
      )}
    </>
  );
};
