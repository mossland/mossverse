import { st, gql, slice, loader } from "@decentverse/data-access";
import { ThreeEvent } from "@react-three/fiber";
import { DataItem } from "@shared/ui-web";
import { Utils } from "@shared/util";
import { ModelProps } from "@shared/util-client";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";
import { NearestFilter, Vector3 } from "three";

export const TileItem = ({
  className,
  tile,
  slice = st.slice.tile,
  actions,
  columns,
  onClick,
}: ModelProps<slice.TileSlice, gql.LightTile>) => {
  const imageClassName =
    "block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[190px] max-w-[190px]";
  return (
    <DataItem
      className={twMerge("", className)}
      onClick={() => onClick?.(tile)}
      title={tile.id}
      model={tile}
      slice={slice}
      actions={actions}
      columns={columns}
    >
      <div className={`relative h-[200px] cursor-pointer`}>
        {tile.bottom && <img className={imageClassName} alt="bottom" src={tile.bottom.url} />}
        {tile.top && <img className={imageClassName} alt="top" src={tile.top.url} />}
        {tile.lighting && <img className={imageClassName} alt="lighting" src={tile.lighting.url} />}
      </div>
    </DataItem>
  );
};

const TileItemWorld = ({
  className,
  tile,
  slice = st.slice.tile,
  actions,
  columns,
}: ModelProps<slice.TileSlice, gql.LightTile>) => {
  const bottom = loader.load(tile.bottom?.url ?? "");
  const wall = tile.wall && loader.load(tile.wall.url);
  const top = tile.top && loader.load(tile.top.url);
  const lighting = tile.lighting && loader.load(tile.lighting?.url);
  const position = new Vector3(...tile.center, 0);
  const mapLayerView = st.use.mapLayerView();
  const mapModal = st.use.mapModal();
  const aux = useRef(false);
  const interaction =
    mapModal && mapModal !== "view" && gql.interactions.includes(mapModal as gql.Interaction) ? mapModal : null;
  Object.assign(bottom, { minFilter: NearestFilter, magFilter: NearestFilter });
  if (wall) Object.assign(wall, { minFilter: NearestFilter, magFilter: NearestFilter });
  if (top) Object.assign(top, { minFilter: NearestFilter, magFilter: NearestFilter });
  if (lighting) Object.assign(lighting, { minFilter: NearestFilter, magFilter: NearestFilter });
  return (
    <mesh
      position={position}
      onClick={async ({ point }) => interaction && st.do[`clickPointerOn${Utils.capitalize(interaction)}`](point)}
      onDoubleClick={() => mapModal !== "view" && slice.do.editTile(tile.id)}
      onPointerMove={(e) => interaction && st.do[`movePointerOn${Utils.capitalize(interaction)}`](e.point)}
    >
      <mesh renderOrder={-1}>
        <planeGeometry args={tile.wh} />
        {mapLayerView.tile.bottom ? <meshStandardMaterial attach="material" map={bottom} transparent /> : null}
      </mesh>
      {wall && (
        <mesh renderOrder={1}>
          <planeGeometry args={tile.wh} />
          {mapLayerView.tile.wall ? <meshBasicMaterial attach="material" map={wall} transparent /> : null}
        </mesh>
      )}
      {top && (
        <mesh renderOrder={2}>
          <planeGeometry args={tile.wh} />
          {mapLayerView.tile.top ? <meshStandardMaterial attach="material" map={top} transparent /> : null}
        </mesh>
      )}
      {lighting && (
        <mesh renderOrder={3}>
          <planeGeometry args={tile.wh} />
          {mapLayerView.tile.lighting ? <meshBasicMaterial map={lighting} transparent /> : null}
        </mesh>
      )}
    </mesh>
  );
};

TileItem.World = TileItemWorld;
