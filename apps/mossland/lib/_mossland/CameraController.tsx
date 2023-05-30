"use client";
import { CameraControls } from "@react-three/drei";

export const CameraController = () => {
  return <CameraControls maxZoom={3} minZoom={1} />;
};
