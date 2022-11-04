import { Suspense, useEffect } from "react";
import { Vector3 } from "three";
import { mapStore } from "../../stores";
import { useInterval } from "@shared/util-client";

export const DayNight = () => {
  const map = mapStore.use.map();
  const daylight = mapStore.use.daylight();
  const checkDayNight = () => {
    const hour = new Date().getHours();
    mapStore.setState({ daylight: hour < 20 && hour > 6 ? "day" : "night" });
  };

  useEffect(() => {
    checkDayNight();
  }, []);

  useInterval(() => {
    checkDayNight();
  }, 600000);

  if (daylight === "day" || !map || !map.config.dayNight) return null;
  const center = [map.wh[0] / 2, map.wh[1] / 2];
  return (
    <Suspense fallback={null}>
      <mesh position={new Vector3(...center, 0.00009)}>
        <planeBufferGeometry attach="geometry" args={map.wh} />
        <meshPhongMaterial attach="material" color={0x233559} opacity={0.4} transparent={true} />
      </mesh>
    </Suspense>
  );
};
