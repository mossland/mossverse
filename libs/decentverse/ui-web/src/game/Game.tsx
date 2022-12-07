import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { store, gql } from "@decentverse/data-access";
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
}

export const Game = ({ socket }: GameProps) => {
  const self = store.user.use.self();
  const renderMe = store.world.use.renderMe();
  const engine = useRef(Engine.create());
  const sprite = useRef<Sprite>(null);
  const animation = useRef<gql.SpriteDef>({ row: 0, column: 1, duration: 1000 });
  const player = useRef<gql.RenderCharacter>({
    position: renderMe.position,
    velocity: [0, 0],
    state: "idle",
    direction: "right",
    chatText: "",
    isTalk: false,
    emoji: "",
    id: "",
  });
  const scope = useRef<gql.WorldScope>({
    min: [0, 0],
    max: [2048, 2048],
  });
  const interaction = useRef<gql.InteractionState>(gql.defaultInteractionState);
  const keyState = useRef(gql.keyboard);
  const lockState = useRef(false);
  const zoom = isMobile ? 2 : 3;
  const map = store.map.use.map();
  if (!self || !map || map === "loading") return <></>;

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
      <StateManagement keyState={keyState} lockState={lockState} player={player} socket={socket} scope={scope} />
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
