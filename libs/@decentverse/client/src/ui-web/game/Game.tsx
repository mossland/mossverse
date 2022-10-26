import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { types, RenderCharacter, userStore, worldStore, mapStore, webviewStore, callRoomStore } from "../../stores";
import { Sprite } from "three";
import { Tiles, Player, Players, StateManagement, DayNight } from "./index";

import { Socket as Soc } from "socket.io-client";
import { Engine } from "matter-js";
import styled from "styled-components";
import { isMobile, isIOS } from "react-device-detect";
import { Placements } from "../asset";
import { Collisions } from "../collision";
import { CallRooms } from "../callRoom";
import { Webviews } from "../webview";
import { Lives } from "../live";
import { useInterval } from "@shared/util-client";

export interface GameProps {
  socket: Soc;
  eventCallback?: types.EventCallback;
}

export const Game = ({ socket, eventCallback }: GameProps) => {
  const self = userStore.use.self();
  const renderMe = worldStore.use.renderMe();
  const engine = useRef(Engine.create());
  const sprite = useRef<Sprite>(null);
  const animation = useRef<types.SpriteDef>({ row: 0, column: 1, duration: 1000 });
  const player = useRef<RenderCharacter>({
    position: renderMe.position,
    velocity: [0, 0],
    state: "idle",
    direction: "right",
    chatText: "",
    isTalk: false,
    id: "",
  });
  const scope = useRef<types.WorldScope>({
    min: [0, 0],
    max: [2048, 2048],
  });
  const interaction = useRef<types.InteractionState>(types.defaultInteractionState);
  const keyState = useRef(types.keyboard);
  const lockState = useRef(false);
  const zoom = isMobile ? 2 : 3;
  const map = mapStore.use.map();
  if (!self || !map) return <></>;

  return (
    <>
      <GameContainer>
        <Canvas
          orthographic
          camera={{ zoom: zoom }}
          style={{ height: "100vh" }}
          gl={{ antialias: false }}
          dpr={Math.max(window.devicePixelRatio, 3)}
        >
          <ambientLight />
          <Player
            sprite={sprite}
            animation={animation}
            keyboard={keyState}
            player={player}
            engine={engine}
            zoom={zoom}
          />
          <Players playerId={self.id} />
          <Tiles player={player} scope={scope} />
          <Placements placements={map.placements} />
          <Lives lives={map.lives} />
          <Collisions engine={engine} collisions={map.collisions} />
          <Webviews webviews={map.webviews} interaction={interaction} player={player} />
          <CallRooms callRooms={map.callRooms} socket={socket} interaction={interaction} player={player} />
          <DayNight />
        </Canvas>
      </GameContainer>
      <StateManagement
        keyState={keyState}
        lockState={lockState}
        player={player}
        socket={socket}
        scope={scope}
        eventCallback={eventCallback}
      />
    </>
  );
};

const GameContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  z-index: 1.5;
  @media screen and (max-width: 800px) {
    width: 100%;
    overflow: hidden;
    overflow-y: hidden;
    overflow-x: hidden;
    /* flex-direction: column; */
  }
  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }
`;
