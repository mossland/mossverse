import dynamic from "next/dynamic";
import { st, gql } from "@mossland/frontend/stores";
import { Ownership, TextSendIcon } from "@shared/ui-web";
import { useEffect, useRef } from "react";
import Router from "next/router";
import { Skeleton } from "antd";
import { Character, Map, Webview } from "@decentverse/ui-web";
import { MapLogin } from "@mossland/frontend/components";
import { ChatRoom, Emoji, GroupCall } from "@social/ui-web";
import { cnst } from "@shared/util";
import { client } from "@shared/util-client";

export default function Page() {
  const mapId = Router.query.mapId as string;
  const self = st.use.self();
  const cam = st.use.cam();
  const mic = st.use.mic();
  const map = st.use.map();
  const playerType = st.use.playerType();
  const playerCharacter = st.use.playerCharacter();
  const playerNickname = st.use.playerNickname();
  const groupCall = st.use.groupCall();
  const webviewModal = st.use.webviewModal();
  const groupCallModal = st.use.groupCallModal();
  const characterModal = st.use.characterModal();
  const emojiModal = st.use.emojiModal();
  const ownershipModal = st.use.ownershipModalInItem();
  const chatTimerRef = useRef<NodeJS.Timeout>();
  const imageTimerRef = useRef<NodeJS.Timeout>();
  console.log(groupCallModal, groupCall);
  useEffect(() => {
    if (!mapId) return;
    st.do.viewMap(mapId);
    st.do.setMapLayerView(gql.decentverse.mapPlayerLayerView);
  }, [mapId]);
  const step = !playerType ? "login" : !playerCharacter.id ? "selectCharacter" : "play";

  if (map === "loading") return <Skeleton />;
  if (step !== "play")
    return (
      <Map.Action.Splash map={map}>
        {step === "login" && <MapLogin map={map} />}
        {step === "selectCharacter" && <Character.Action.SelectPlayerCharacter self={self} />}
      </Map.Action.Splash>
    );
  if (step === "play")
    return (
      <div className="absolute top-0 left-0 flex w-full h-full p-3 overflow-hidden z-2">
        <div className="flex justify-between w-full">
          <div className="flex ">
            <Character.Action.ProfilePreview />
            <div className="text-white text-[26px] leading-[1.1em]" style={{ textShadow: "0px 2px 0 #000" }}>
              <Ownership.View.Stock name="MMOC" type="thing" self={self} slice={st.slice.ownershipInMoney} />
              <Ownership.View.Stock name="Point" type="thing" self={self} slice={st.slice.ownershipInMoney} />
            </div>
          </div>
          <div>
            {ownershipModal === "open" ? (
              <div
                className={`md:origin-top-right md:animate-inventoryOpen absolute top-1/2 left-1/2 w-[383px]  -translate-x-1/2 -translate-y-1/2 z-[100] md:translate-x-1/2 md:translate-y-1/2  md:top-0 md:left-0 md:relative`}
              >
                {<Ownership.List.Inventory slice={st.slice.ownershipInItem} />}
              </div>
            ) : (
              <Ownership.Action.InventoryPreview />
            )}
          </div>
        </div>
        <div></div>
        <div className="absolute left-0 flex items-center justify-center w-full bottom-5 ">
          <div className="flex w-[100%] md:w-[90%] m-[20px] md:translate-x-0">
            <div className="flex w-full items-end justify-center  gap-[5px]">
              <div className="">
                {emojiModal !== "open" ? (
                  <Emoji.Action.Open />
                ) : (
                  <Emoji.List.Box
                    className="origin-bottom animate-emojiOpen"
                    onClick={(emoji) => {
                      if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
                      st.do.setPlayerEmojiUrl(emoji.file.url);
                      imageTimerRef.current = setTimeout(() => st.do.setPlayerEmojiUrl(null), 3000);
                    }}
                  />
                )}
              </div>
              <ChatRoom.Action.ChattingBar
                onFocus={() => {
                  st.do.setKeyLock(true);
                  st.do.setKeyboard(gql.decentverse.defaultKeyboard);
                }}
                onBlur={() => {
                  st.do.setKeyLock(false);
                  st.do.setKeyboard(gql.decentverse.defaultKeyboard);
                }}
                onSend={(text) => {
                  if (chatTimerRef.current) clearTimeout(chatTimerRef.current);
                  st.do.setPlayerChatText(text);
                  chatTimerRef.current = setTimeout(() => st.do.setPlayerChatText(""), 3000);
                  client.socket?.emit("chat", ["public", { nickname: playerNickname, text }]);
                }}
              />
            </div>
            <div className="items-end hidden ml-2 md:flex">
              <ChatRoom.List.Logs />
            </div>
          </div>
        </div>
        {groupCall !== "loading" && groupCallModal === "join" && (
          <div className="absolute p-5 top-10 left-30">
            <GroupCall.View.Connection
              selfId={self.id ?? playerNickname}
              groupCall={groupCall}
              actions={
                <div className="absolute left-1/2 bottom-[5%] w-full z-[1] gap-5 -translate-x-1/2 flex justify-center">
                  {cam ? <GroupCall.Action.CamActiveSelf /> : <GroupCall.Action.CamInactiveSelf />}
                  {mic > 0 ? <GroupCall.Action.MicActiveSelf /> : <GroupCall.Action.MicInactiveSelf />}
                </div>
              }
            />
            <GroupCall.Action.OtherCalls />
          </div>
        )}
        <div className="absolute left-0 flex justify-between w-full px-8 bottom-28 md:hidden">
          <div className="w-30"> </div>
          <Character.Action.Controller />
        </div>
        {characterModal === "profile" && <Character.View.Profile self={self} />}
        {webviewModal === "open" && <Webview.View.Modal />}
      </div>
    );
}
Page.canvas = (props) => {
  const self = st.use.self();
  const map = st.use.map();
  const playerCharacter = st.use.playerCharacter();
  if (map === "loading") return null;
  return (
    <mesh>
      <Map.View.World
        map={map}
        onCallRoomJoin={(callRoom) => {
          st.do.joinGroupCall(callRoom.id, callRoom.roomType as cnst.GroupCallType);
        }}
        onCallRoomLeave={() => {
          st.do.leaveGroupCall();
        }}
      />
      {playerCharacter.id && <Character.View.Player map={map} self={self} spawnKey={Router.query.spawnKey as string} />}
      <Character.Action.OtherPlayers />
    </mesh>
  );
};
