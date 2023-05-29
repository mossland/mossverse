"use client";
import { AreaBox } from "../../client";
import { BiX } from "react-icons/bi";
import { DataItem } from "@shared/client";
import { Mesh, Vector3 } from "three";
import { ModelProps, logger } from "@util/client";
import { fetch, loader, st } from "@decentverse/client";
import { memo, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const Admin = ({
  className,
  teleport,
  sliceName = "teleport",
  actions,
  columns,
}: ModelProps<"teleport", fetch.LightTeleport>) => {
  return (
    <DataItem
      className={className}
      title={`Teleport`}
      model={teleport}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    >
      <button onClick={() => st.do.selectTeleport(teleport, { remove: true })} className="absolute top-0 right-0 m-5">
        <BiX />
      </button>
      <AreaBox color="#36B3A0" wh={teleport.wh} center={teleport.center} />
      <div>Href: {teleport.href}</div>
    </DataItem>
  );
};

export const World = memo(({ className, teleport, actions, columns }: ModelProps<"teleport", fetch.LightTeleport>) => {
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
    <mesh position={position} onClick={() => st.do.selectTeleport(teleport, { refresh: true })}>
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
});
