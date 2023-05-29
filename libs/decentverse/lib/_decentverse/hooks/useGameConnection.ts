"use client";

import { client, useInterval } from "@util/client";
import { decodeProtocolV1, encodeProtocolV1, makeCharacterMessage as makePlayerInitMessage } from "./protocol";
import { fetch, st } from "@decentverse/client";
import { useEffect } from "react";

// 소켓 데이터 처리를 주로 진행
export const useGameConnection = (userId: string) => {
  const map = st.use.map();
  const playerNickname = st.ref((state) => state.playerNickname);
  const playerType = st.ref((state) => state.playerType);
  const playerCharacter = st.ref((state) => state.playerCharacter);
  const playerMaxSpeed = st.ref((state) => state.playerMaxSpeed);
  const playerAcceleration = st.ref((state) => state.playerAcceleration);
  const playerDeceleration = st.ref((state) => state.playerDeceleration);
  const playerVelocity = st.ref((state) => state.playerVelocity);
  const playerPosition = st.ref((state) => state.playerPosition);
  const playerSpriteState = st.ref((state) => state.playerSpriteState);
  const playerDirection = st.ref((state) => state.playerDirection);
  const playerChatText = st.ref((state) => state.playerChatText);
  const playerEmojiUrl = st.ref((state) => state.playerEmojiUrl);
  const playerStatus = st.ref((state) => state.playerStatus);
  const id = userId ?? playerNickname.current;
  const otherPlayerInitMap = st.ref((state) => state.otherPlayerInitMap);
  const otherPlayerRenderMap = st.ref((state) => state.otherPlayerRenderMap);
  useEffect(() => {
    if (!client.socket?.connected || map === "loading") return;
    const playerInit: fetch.PlayerInit = {
      playerNickname: playerNickname.current,
      playerType: playerType.current,
      playerCharacter: playerCharacter.current,
      playerMaxSpeed: playerMaxSpeed.current,
      playerAcceleration: playerAcceleration.current,
      playerDeceleration: playerDeceleration.current,
    };
    const register = () => client.socket?.emit("register", id, makePlayerInitMessage(id, playerInit));
    register();
    window.addEventListener("focus", register);
    window.addEventListener("blur", register);
    client.socket.on("players", (data) => {
      const playerRenders = data.map((dat: string) => decodeProtocolV1(dat));
      const playerRenderMap = new Map<string, fetch.PlayerRender>();
      const ids = playerRenders
        .map(([userId, playerRender]) => {
          if (id === userId) return null;
          const has = otherPlayerRenderMap.current.has(userId);
          playerRenderMap.set(userId, playerRender);
          return has ? null : userId;
        })
        .filter((userId: string) => !!userId && id !== userId);
      if (ids.length) client.socket?.emit("characters", ids);
      st.set({ otherPlayerRenderMap: playerRenderMap });
    });
    client.socket.on("characters", (ids, datas) => {
      const playerInitMap = new Map(otherPlayerInitMap.current);
      datas
        .map(JSON.parse)
        .filter((d) => !!d)
        .map((d) => playerInitMap.set(d.id, d));
      st.set({ otherPlayerInitMap: playerInitMap });
    });
    return () => {
      client.socket?.off("players");
      client.socket?.off("characters");
      window.removeEventListener("focus", register);
      window.removeEventListener("blur", register);
    };

    // client.socket.on("adminEvent", ({ event, id, roomId }) => {
    //   if (event === "kicked" && id === self.nickname) kicked();
    //   else if (event === "muted" && id === self.nickname) forceMute();
    // });
  }, []);
  useInterval(() => {
    if (map === "loading") return;
    const data = encodeProtocolV1(
      map.id,
      userId ?? playerNickname.current,
      {
        playerVelocity: playerVelocity.current,
        playerPosition: playerPosition.current,
        playerSpriteState: playerSpriteState.current,
        playerDirection: playerDirection.current,
        playerChatText: playerChatText.current,
        playerEmojiUrl: playerEmojiUrl.current,
        playerStatus: playerStatus.current,
      },
      { min: [0, 0], max: [10000, 10000] }
    );
    client.socket?.emit("player", ...data);
  }, 250);
};
