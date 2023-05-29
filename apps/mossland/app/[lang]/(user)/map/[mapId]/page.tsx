"use client";
import { Character, Map, Webview } from "@decentverse/client";
import { ChatRoom, Emoji, GroupCall } from "@social/client";
import { MapLogin, fetch, st } from "@mossland/client";
import { Ownership, Skeleton } from "@shared/client";
import { client } from "@util/client";
import { useEffect, useRef } from "react";

export default function Page({ params: { mapId } }) {
  const self = st.use.self();
  const map = st.use.map();
  const playerType = st.use.playerType();
  const playerCharacter = st.use.playerCharacter();
  const playerNickname = st.use.playerNickname();
  const groupCall = st.use.groupCall();
  const webviewModal = st.use.webviewModal();
  const groupCallModal = st.use.groupCallModal();
  const characterModal = st.use.characterModal();
  const emojiModal = st.use.emojiModal();
  const ownershipModal = st.use.ownershipModal();
  const chatTimerRef = useRef<NodeJS.Timeout>();
  const imageTimerRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    st.do.setMapLayerView(fetch.decentverse.mapPlayerLayerView);
  }, [mapId]);
  const step = !playerType ? "login" : !playerCharacter.id ? "selectCharacter" : "play";
  if (map === "loading") return <Skeleton />;
  if (step !== "play")
    return (
      <Map.Util.Splash map={map}>
        <MapLogin />
        {step === "selectCharacter" && <Character.Util.SelectPlayerCharacter />}
      </Map.Util.Splash>
    );
  if (step === "play")
    return (
      <div className="absolute top-0 left-0 flex w-full h-full p-3 overflow-hidden z-2">
        <div className="flex justify-between w-full">
          <div className="flex ">
            <Character.Util.ProfilePreview />
            <div className="text-white text-[26px] leading-[1.1em]" style={{ textShadow: "0px 2px 0 #000" }}>
              <Ownership.View.ViewStock name="MMOC" type="thing" self={self} />
              <Ownership.View.ViewStock name="Point" type="thing" self={self} />
            </div>
          </div>
          <div>
            {ownershipModal === "open" ? (
              <div
                className={`md:origin-top-right md:animate-inventoryOpen absolute top-1/2 left-1/2 w-[383px]  -translate-x-1/2 -translate-y-1/2 z-[100] md:translate-x-1/2 md:translate-y-1/2  md:top-0 md:left-0 md:relative`}
              >
                <Ownership.Zone.Inventory />
              </div>
            ) : (
              <Ownership.Util.InventoryPreview />
            )}
          </div>
        </div>
        <div></div>
        <div className="absolute left-0 flex items-center justify-center w-full bottom-5 ">
          <div className="flex w-[100%] md:w-[90%] m-[20px] md:translate-x-0">
            <div className="flex w-full items-end justify-center  gap-[5px]">
              <div className="">
                {emojiModal !== "open" ? (
                  <Emoji.Util.Open />
                ) : (
                  <Emoji.Zone.Box
                    className="origin-bottom animate-emojiOpen"
                    onClick={(emoji) => {
                      if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
                      st.do.setPlayerEmojiUrl(emoji.file.url);
                      imageTimerRef.current = setTimeout(() => st.do.setPlayerEmojiUrl(null), 3000);
                    }}
                  />
                )}
              </div>
              <ChatRoom.Util.ChattingBar
                onFocus={() => {
                  st.do.setKeyLock(true);
                  st.do.setKeyboard(fetch.decentverse.defaultKeyboard);
                }}
                onBlur={() => {
                  st.do.setKeyLock(false);
                  st.do.setKeyboard(fetch.decentverse.defaultKeyboard);
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
              <ChatRoom.Zone.Logs />
            </div>
          </div>
        </div>
        {groupCall !== "loading" && groupCallModal === "join" && (
          <div className="absolute p-5 top-10 left-30">
            <GroupCall.View.Connection selfId={self.id ?? playerNickname} groupCall={groupCall} />
            <GroupCall.Util.OtherCalls />
          </div>
        )}
        <div className="absolute left-0 flex justify-between w-full px-8 bottom-28 md:hidden">
          <div className="w-30"> </div>
          <Character.Util.Controller />
        </div>
        {characterModal === "profile" && <Character.Zone.Profile self={self} />}
        {webviewModal === "open" && <Webview.View.Modal />}
      </div>
    );
}
