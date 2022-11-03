import { useEffect, MutableRefObject } from "react";
import { io, Socket as Soc } from "socket.io-client";
import { useInterval } from "@shared/util-client";
import PubSub from "pubsub-js";
import { store, gql } from "@decentverse/data-access";
import { encodeProtocolV1, decodeProtocolV1, makeCharacterMessage } from "../_utils";

export interface SocketProp {
  player: MutableRefObject<gql.RenderCharacter>;
  scope: MutableRefObject<gql.WorldScope>;
  socket: Soc;
}

// 소켓 데이터 처리를 주로 진행
export const useGameConnection = ({ player, scope, socket }: SocketProp) => {
  const self = store.user.use.self();
  const character = store.world.use.me().character;
  const chatText = store.gossip.use.chatText();
  const isTalk = store.callRoom.use.callRoom().isTalk;
  const emoji = store.emoji.use.emoji();
  const forceMute = store.callRoom.use.forceMute();
  const kicked = () => store.world.setState({ isKicked: true });
  const addOtherPlayers = store.world.use.addOtherPlayers();
  const setOtherPlayerIds = (otherPlayerIds: string[]) => store.world.setState({ otherPlayerIds });
  useEffect(() => {
    if (!self) return;
    socket.emit("register", self.id, makeCharacterMessage(self, character));
    window.addEventListener("focus", () => socket.emit("register", self.id, makeCharacterMessage(self, character)));
    window.addEventListener("blur", () => socket.emit("register", self.id, makeCharacterMessage(self, character)));
    socket.on("players", (data) => {
      const players = data.map((dat: string) => dat && decodeProtocolV1(dat)).filter((d: any) => !!d);
      const ids = players.map((player: gql.RenderOtherPlayer) => {
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
          const { user, character }: { user: gql.User; character: gql.Character } = JSON.parse(data);
          return { id, user, character, updatedAt: now };
        })
        .filter((player: gql.OtherPlayer) => !!player?.character);
      if (otherPlayers.length) addOtherPlayers(otherPlayers);
    });
    socket.on("adminEvent", ({ event, id, roomId }) => {
      if (event === "kicked" && id === self.nickname) kicked();
      else if (event === "muted" && id === self.nickname) forceMute();
    });

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
      },
      scope.current
    );
    socket.emit("player", ...data);
  }, 250);
};
