"use client";
import { DataItem } from "@shared/client";
import { ModelProps } from "@util/client";
import { Vector3 } from "three";
import { fetch, loader, st } from "@decentverse/client";
import { twMerge } from "tailwind-merge";

export const Admin = ({
  className,
  placement,
  sliceName = "placement",
  actions,
  columns,
  onClick,
}: ModelProps<"placement", fetch.LightPlacement>) => {
  const imageClassName =
    "block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[190px] max-w-[190px]";
  return (
    <DataItem
      className={twMerge("", className)}
      onClick={() => onClick?.(placement)}
      title={`Placment-${placement.asset.name}`}
      model={placement}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    >
      <div className={`relative h-[200px] cursor-pointer`}>
        <button>close</button>
        {placement.asset.bottom?.url && (
          <img className={imageClassName} alt="bottom" src={placement.asset.bottom.url} />
        )}
        {placement.asset.wall?.url && <img className={imageClassName} alt="wall" src={placement.asset.wall.url} />}
        {placement.asset.top?.url && <img className={imageClassName} alt="top" src={placement.asset.top.url} />}
        {placement.asset.lighting?.url && (
          <img className={imageClassName} alt="lighting" src={placement.asset.lighting.url} />
        )}
      </div>
      <div>
        center: {placement.center[0].toFixed(4)}, {placement.center[1].toFixed(4)}
      </div>
      <div>
        wh: {placement.wh[0].toFixed(4)}, {placement.wh[1].toFixed(4)}
      </div>
    </DataItem>
  );
};

export const World = ({ className, placement, actions, columns }: ModelProps<"placement", fetch.LightPlacement>) => {
  const mapModal = st.use.mapModal();
  const mapLayerView = st.use.mapLayerView();
  const top = placement.asset?.top && loader.load(placement.asset.top.url);
  const bottom = placement.asset?.bottom && loader.load(placement.asset.bottom.url);
  const wall = placement.asset?.wall && loader.load(placement.asset.wall.url);
  const lighting = placement.asset?.lighting && loader.load(placement.asset.lighting.url);
  return (
    <mesh
      position={new Vector3(...placement.center, 0)}
      onClick={() => mapModal === "select" && st.do.selectPlacement(placement, { refresh: true })}
    >
      {mapLayerView.placement.bottom && bottom && (
        <mesh renderOrder={-1}>
          <planeGeometry args={placement.wh} />
          <meshBasicMaterial map={bottom} transparent />
        </mesh>
      )}
      {mapLayerView.placement.wall && wall && (
        <mesh renderOrder={1}>
          <planeGeometry args={placement.wh} />
          <meshBasicMaterial map={wall} transparent />
        </mesh>
      )}
      {mapLayerView.placement.top && top && (
        <mesh renderOrder={2}>
          <planeGeometry args={placement.wh} />
          <meshBasicMaterial map={top} transparent />
        </mesh>
      )}
      {mapLayerView.placement.lighting && lighting && (
        <mesh renderOrder={3}>
          <planeGeometry args={placement.wh} />
          <meshBasicMaterial map={lighting} transparent />
        </mesh>
      )}
    </mesh>
  );
};
