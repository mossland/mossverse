import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { DataEditModal, DataListContainer, DataTableList, LoadItems } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap, useInterval } from "@shared/util-client";
import * as CallRoom from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";
import { Overlay } from "../common/Overlay";
import { Utils } from "@shared/util";
import { useEffect } from "react";

export const CallRoomList = ({ slice = st.slice.callRoom, init }: ModelsProps<slice.CallRoomSlice, gql.CallRoom>) => {
  return (
    <LoadItems
      noDiv
      slice={slice}
      init={init}
      loading={null}
      renderItem={(callRoom: gql.LightCallRoom, idx) => <CallRoom.Item slice={slice} callRoom={callRoom} idx={idx} />}
    />
  );
};

const CallRoomListWorld = ({
  slice = st.slice.callRoom,
  init,
  onJoin,
  onLeave,
}: ModelsProps<slice.CallRoomSlice, gql.CallRoom> & {
  onJoin?: (callRoom: gql.CallRoom) => void;
  onLeave?: (callRoom: gql.CallRoom) => void;
}) => {
  const callRoom = slice.use.callRoom();
  const callRoomList = slice.use.callRoomList();
  const playerPosition = st.ref((state) => state.playerPosition);
  const callRoomModal = slice.use.callRoomModal();
  useInterval(() => {
    if (callRoomList === "loading") return;
    if (callRoom !== "loading") {
      if (Utils.isInside(playerPosition.current, callRoom)) return;
      if (callRoomModal === "join") slice.do.resetCallRoom();
    } else {
      for (const callRoom of callRoomList) {
        if (!Utils.isInside(playerPosition.current, callRoom)) continue;
        slice.do.viewCallRoom(callRoom.id, { modal: "join" });
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
      <LoadItems
        noDiv
        slice={slice}
        init={init}
        loading={null}
        renderItem={(callRoom: gql.LightCallRoom, idx) => (
          <CallRoom.Item.World key={callRoom.id} slice={slice} callRoom={callRoom} idx={idx} />
        )}
      />
      {callRoom === "loading" || callRoomModal !== "join" ? null : (
        <Overlay center={callRoom.center} wh={callRoom.wh} />
      )}
    </>
  );
};
CallRoomList.World = CallRoomListWorld;
