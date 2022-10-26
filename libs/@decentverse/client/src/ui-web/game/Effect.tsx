import React, { Suspense, useState } from "react";
import { Html } from "@react-three/drei";
import { types } from "../../stores";

export interface EffectProp {
  effectType: types.EffectType;
}

export const Effect = ({ effectType }: EffectProp) => {
  if (effectType === "none") return null;

  return (
    <mesh rotation={[0, 0, 0]} position={[0, effectType === "goldenBell" ? 80 : 0, 0]}>
      <Html
        center
        style={{
          maxWidth: 200,
          width: "max-content",
          opacity: 0.8,
        }}
      >
        {effectType === "goldenBell" && <img src="./golden-bell.gif" width="100%" alt="effect image" />}
        {effectType === "donationIn" && <img src="./donation-in.gif" width="100%" alt="effect image" />}
        {effectType === "donationOut" && <img src="./donation-out.gif" width="100%" alt="effect image" />}
      </Html>
    </mesh>
  );
};
