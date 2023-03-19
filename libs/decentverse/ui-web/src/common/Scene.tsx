import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, MapControls, PerspectiveCamera } from "@react-three/drei";
import { Physics } from "@react-three/p2";
import { OrthographicCamera } from "three";
import { isMobile } from "react-device-detect";

export default function Scene({ children, ...props }) {
  const w = window.innerWidth / 2;
  const camera = new OrthographicCamera(-w, w, w, -w, -10, 4000);
  camera.zoom = 4;

  return (
    <Canvas {...props} camera={camera} orthographic>
      <directionalLight intensity={0.75} />
      <ambientLight intensity={0.75} />
      <Physics gravity={[0, 0]} normalIndex={2}>
        {children}
      </Physics>
      {/* <Preload all /> */}
    </Canvas>
  );
}
