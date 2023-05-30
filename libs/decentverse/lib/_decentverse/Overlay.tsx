"use client";
import { Utils } from "@util/client";
import { Vector3 } from "three";

interface OverlayProps {
  center: [number, number];
  wh: [number, number];
}

export const Overlay = ({ center, wh }: OverlayProps) => {
  const offset = 10000;
  const positionZ = 1;
  const boxes = [
    {
      center: Utils.moveCenter(center, [wh[0] / 2, 0], [offset / 2, 0]),
      wh: [offset, offset],
    },
    {
      center: Utils.moveCenter(center, [-wh[0] / 2, 0], [-offset / 2, 0]),
      wh: [offset, offset],
    },
    {
      center: Utils.moveCenter(center, [0, wh[1] / 2], [0, offset / 2]),
      wh: [wh[0], offset],
    },
    {
      center: Utils.moveCenter(center, [0, -wh[1] / 2], [0, -offset / 2]),
      wh: [wh[0], offset],
    },
  ];
  return (
    <>
      {boxes.map((box, idx) => (
        <mesh position={new Vector3(...box.center, positionZ)} key={idx} renderOrder={3}>
          <planeGeometry attach="geometry" args={box.wh as [number, number]} />
          <meshPhongMaterial attach="material" color={0x000000} opacity={0.4} transparent={true} />
        </mesh>
      ))}
    </>
  );
};
