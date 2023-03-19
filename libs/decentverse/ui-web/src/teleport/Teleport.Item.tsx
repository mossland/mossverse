import { st, gql, slice, useLocale, loader } from "@decentverse/data-access";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { DataItem } from "@shared/ui-web";
import { logger, ModelProps } from "@shared/util-client";
import Router from "next/router";
import { memo, useMemo, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { Mesh, Vector3 } from "three";
import { AreaBox } from "../common";

export const TeleportItem = ({
  className,
  teleport,
  slice = st.slice.teleport,
  actions,
  columns,
}: ModelProps<slice.TeleportSlice, gql.LightTeleport>) => {
  return (
    <DataItem
      className={className}
      title={`Teleport`}
      model={teleport}
      slice={slice}
      actions={actions}
      columns={columns}
    >
      <AreaBox color="#36B3A0" wh={teleport.wh} center={teleport.center} />
      <div>Href: {teleport.href}</div>
    </DataItem>
  );
};

const TeleportItemWorld = memo(
  ({
    className,
    teleport,
    slice = st.slice.teleport,
    actions,
    columns,
  }: ModelProps<slice.TeleportSlice, gql.LightTeleport>) => {
    const mapLayerView = st.use.mapLayerView();
    const position = useMemo(() => new Vector3(...teleport.center, 0), []);
    const leftArrow = loader.load("/left-arrow-mv.png");
    const rightArrow = loader.load("/right-arrow-mv.png");
    const left = useRef<Mesh>(null);
    const right = useRef<Mesh>(null);
    logger.verbose("Teleport rerender");
    //! temp code
    const spawnKey = teleport.href.includes("left") ? "left" : "right";
    useFrame((state) => {
      const delta = Date.now();
      left.current?.position.set(50 + 5 * Math.sin(delta / 200), 0, 1);
      right.current?.position.set(-50 + 5 * Math.sin(delta / 200), 0, 1);
    });
    return (
      <mesh position={position} onClick={() => slice.do.selectTeleport(teleport, { refresh: true })}>
        {spawnKey === "right" && (
          <mesh position={new Vector3(50, 0, 1)} ref={left}>
            <planeGeometry args={[20, 20]} />
            <meshBasicMaterial map={leftArrow} transparent />
          </mesh>
        )}
        <mesh>
          {mapLayerView.teleport && <planeGeometry attach="geometry" args={[...teleport.wh]} />}
          <meshPhongMaterial attach="material" color="#2222cc" opacity={0.7} transparent={true} />
        </mesh>
        {spawnKey === "left" && (
          <mesh position={new Vector3(-50, 0, 1)} ref={right}>
            <planeGeometry args={[20, 20]} />
            <meshBasicMaterial map={rightArrow} transparent />
          </mesh>
        )}
      </mesh>
    );
  }
);
TeleportItem.World = TeleportItemWorld;

//1280, 670 right

//560, 480 left
