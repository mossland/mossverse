import { useEffect, MutableRefObject } from "react";
import { io, Socket as Soc } from "socket.io-client";
import { useInterval } from "../hooks/useInterval";
import PubSub from "pubsub-js";
import {
  types,
  stores,
  useEmoji,
  useVisualEffect,
  worldStore,
  userStore,
  gossipStore,
  callRoomStore,
  emojiStore,
} from "../stores";
import { encodeProtocolV1, decodeProtocolV1, makeCharacterMessage } from "../utils";
import { worldEventStore } from "../stores/worldEvent";

export interface SocketProp {
  player: MutableRefObject<types.RenderCharacter>;
  scope: MutableRefObject<types.WorldScope>;
  socket: Soc;
  eventCallback?: types.EventCallback;
}

// 소켓 데이터 처리를 주로 진행
export const useGameConnection = ({ player, scope, socket, eventCallback }: SocketProp) => {
  const self = userStore.use.self();
  const character = worldStore.use.me().character;
  const chatText = gossipStore.use.chatText();
  const isTalk = callRoomStore.use.callRoom().isTalk;
  const emoji = emojiStore((state) => state.emoji);
  const forceMute = callRoomStore.use.forceMute();
  const kicked = () => worldEventStore.setState({ isKicked: true });
  const addOtherPlayers = worldStore.use.addOtherPlayers();
  const setOtherPlayerIds = (otherPlayerIds: string[]) => worldStore.setState({ otherPlayerIds });
  const effectType = useVisualEffect((state) => state.effectType);
  useEffect(() => {
    if (!self) return;
    socket.emit("register", self.id, makeCharacterMessage(self, character));
    window.addEventListener("focus", () => socket.emit("register", self.id, makeCharacterMessage(self, character)));
    window.addEventListener("blur", () => socket.emit("register", self.id, makeCharacterMessage(self, character)));
    socket.on("players", (data) => {
      const players = data.map((dat: string) => dat && decodeProtocolV1(dat)).filter((d: any) => !!d);
      const ids = players.map((player: types.RenderOtherPlayer) => {
        PubSub.publish(player.id, player);
        return player.id;
      });
      if (ids.length) socket.emit("characters", ids);
      setOtherPlayerIds(ids);
    });
    socket.on("characters", (ids, datas) => {
      const now = new Date().getTime();
      const otherPlayers = datas
        .map((data: string, idx: number) => {
          if (!data) return null;
          const id = ids[idx];
          const { user, character }: { user: types.User; character: types.Character } = JSON.parse(data);
          return { id, user, character, updatedAt: now };
        })
        .filter((player: types.OtherPlayer) => !!player?.character);
      if (otherPlayers.length) addOtherPlayers(otherPlayers);
    });
    socket.on("adminEvent", ({ event, id, roomId }) => {
      if (event === "kicked" && id === self.nickname) kicked();
      else if (event === "muted" && id === self.nickname) forceMute();
    });

    // eventCallback &&
    //   socket.on("events", async (data: types.EventCallbackParameters) => {
    //     await eventCallback(stores, data);
    //   });

    return () => {
      socket.close();
    };
  }, []);
  useInterval(() => {
    if (!socket || !self) return;

    const data = encodeProtocolV1(
      {
        ...player.current,
        id: self.id,
        chatText,
        type: self.role,
        isTalk,
        emoji: emoji?.file.url ?? "",
        effect: effectType,
      },
      scope.current
    );
    socket.emit("player", ...data);
  }, 250);
};
