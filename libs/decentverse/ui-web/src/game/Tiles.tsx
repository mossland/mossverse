import React, { Suspense, useRef, MutableRefObject, useMemo, useEffect } from "react";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { store, gql } from "@decentverse/data-access";
import { Group, Scene, Sprite, SpriteMaterial, TextureLoader, Vector, Vector3 } from "three";
import { useTexture } from "@react-three/drei";
import { makeScope } from "../_utils";
import { useInterval } from "@shared/util-client";
import * as THREE from "three";
export interface MapProp {
  player?: MutableRefObject<gql.RenderCharacter>;
  scope?: MutableRefObject<gql.WorldScope>;
  mouse?: MutableRefObject<gql.Mouse>;
}

export const Tiles = ({ player, scope, mouse }: MapProp) => {
  const screen = store.game.use.screen();

  useInterval(() => {
    if (!player || !scope) return;
    const showBox = {
      min: [player.current.position[0] - screen.size[0], player.current.position[1] - screen.size[1] / 4],
      max: [player.current.position[0] + screen.size[0] / 4, player.current.position[1] + screen.size[1] / 4],
    };
    scope.current = makeScope(showBox);
  }, 500);
  const handleWheel = (e: ThreeEvent<WheelEvent> | any) => {
    if (player || !e.ctrlKey) return;
    const delta = e.deltaY > 1 ? 100 : e.deltaY < -1 ? -100 : 0;
    const z = e.camera.position.z + delta;
    if (z > 4000 || z < 100) return;
    e.camera.translateZ(delta);
  };
  const aux = useRef(false);
  const handleMove = (e: ThreeEvent<PointerEvent> | any) => {
    if (player) return;
    if (mouse) mouse.current.copy(e.point);
    if (!aux.current) return;
    e.camera.translateX(Math.floor(-e.movementX / 2));
    e.camera.translateY(Math.floor(e.movementY / 2));
  };
  /*
  ? e.button.0 : trackpad click
  ? e.button.1 : mouse click
  */
  const handlePointerUp = (e: ThreeEvent<PointerEvent> | any) =>
    (e.button === 0 || e.button === 1) && (aux.current = false);
  const handlePointerDown = (e: ThreeEvent<PointerEvent> | any) =>
    (e.button === 0 || e.button === 1) && (aux.current = true);

  const tiles = store.map((state) => state.map?.tiles);
  const tileSize = store.map((state) => state.map?.tileSize);
  if (store.map === "loading") return <></>;

  return (
    <Suspense fallback={null}>
      <mesh
        onWheel={handleWheel}
        onPointerMove={handleMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {tiles &&
          tileSize &&
          tiles
            // .slice(...render.tiles[1])
            .map((tileArr, idxy) =>
              tileArr
                // .slice(...render.tiles[0])
                .map((tile, idxx) => {
                  const offsetX = tileSize / 2 + idxx * tileSize;
                  const offsetY = tileSize / 2 + (tiles.length - idxy - 1) * tileSize;
                  return <Tile key={tile.id} offsetX={offsetX} offsetY={offsetY} tile={tile} tileSize={tileSize} />;
                })
            )}
      </mesh>
    </Suspense>
  );
};
export interface TileProp {
  offsetX: number;
  offsetY: number;
  tile: gql.Tile;
  tileSize: number;
}
const loader = new TextureLoader();
export const Tile = React.memo(({ offsetX, offsetY, tile, tileSize }: TileProp) => {
  const bottom = loader.load(tile.bottom?.url ?? "");
  const top = tile.top && loader.load(tile.top.url);
  const lighting = tile.lighting && loader.load(tile.lighting?.url);
  const position = new Vector3(offsetX, offsetY, -0.0000001);
  const topPos = new Vector3(offsetX, offsetY, 0.00001);
  const lightPos = new Vector3(offsetX, offsetY, 0.0001);
  bottom.minFilter = THREE.NearestFilter;
  bottom.magFilter = THREE.NearestFilter;
  if (top) {
    top.minFilter = THREE.NearestFilter;
    top.magFilter = THREE.NearestFilter;
  }
  if (lighting) {
    lighting.minFilter = THREE.NearestFilter;
    lighting.magFilter = THREE.NearestFilter;
  }
  const handleClick = (e: ThreeEvent<PointerEvent> | any) => {
    store.map.setState({ pointer: e.point });
  };
  return (
    <Suspense fallback={null}>
      <mesh position={position} onClick={handleClick}>
        <planeGeometry args={[tileSize, tileSize]} />
        <meshBasicMaterial attach="material" map={bottom} transparent />
      </mesh>
      {top && (
        <mesh position={topPos}>
          <planeGeometry args={[tileSize, tileSize]} />
          <meshBasicMaterial attach="material" map={top} transparent />
        </mesh>
      )}
      {lighting && (
        <mesh position={lightPos}>
          <planeGeometry args={[tileSize, tileSize]} />
          <meshBasicMaterial map={lighting} transparent />
        </mesh>
      )}
    </Suspense>
  );
});
