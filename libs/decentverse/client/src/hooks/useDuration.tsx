import { useRef, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { types } from "../stores";
export const useDuration = (callback: (p: number) => void, def: MutableRefObject<types.SpriteDef>) => {
  const t = useRef(0);
  const p = useRef(0);
  useFrame((_, delta) => {
    t.current += delta * 1000;
    if (t.current < def.current.duration / def.current.column) return;
    callback(p.current);
    t.current = 0;
    p.current = p.current + 1 >= def.current.column ? 0 : p.current + 1;
  });
};
