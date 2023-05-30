"use client";
import { Vector3 } from "three";
import { fetch, loader } from "@decentverse/client";

export const Layer = ({
  file,
  center = [0, 0],
  wh,
  z = 0,
  opacity = 1,
  onClick,
}: {
  file: fetch.shared.File;
  center?: [number, number];
  wh: [number, number];
  z?: number;
  opacity?: number;
  onClick?: () => void;
}) => {
  const texture = loader.load(file.url);
  return (
    <mesh position={new Vector3(...center, z)} onClick={onClick}>
      <planeGeometry args={wh} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} />
    </mesh>
  );
};
