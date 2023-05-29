"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { SpriteDef } from "../decentverse.fetch";

export const useSprite = (callback: (p: number) => void, spriteDef: SpriteDef) => {
  const t = useRef(0);
  const p = useRef(0);
  useFrame((_, delta) => {
    t.current += delta * 1000;
    if (t.current < spriteDef.duration / spriteDef.column) return;
    callback(p.current);
    t.current = 0;
    p.current = p.current + 1 >= spriteDef.column ? 0 : p.current + 1;
  });
};
