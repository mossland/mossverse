"use client";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "three";
import { Physics } from "@react-three/p2";
import { st } from "../../client";

export default function Scene({ children, className }) {
  const w = st.use.innerWidth();
  const camera = new OrthographicCamera(-w, w, w, -w, -10, 4000);
  camera.zoom = 4;

  return (
    <Canvas className={className} camera={camera} orthographic>
      <directionalLight intensity={0.75} />
      <ambientLight intensity={0.75} />
      <Physics gravity={[0, 0]} normalIndex={2}>
        {children}
      </Physics>
      {/* <Preload all /> */}
    </Canvas>
  );
}
