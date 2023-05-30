"use client";
import { DataItem } from "@shared/client";
import { ModelProps } from "@util/client";
import { NearestFilter, Vector3 } from "three";
import { Utils } from "@util/client";
import { fetch, loader, st } from "@decentverse/client";
import { twMerge } from "tailwind-merge";

export const Admin = ({
  className,
  tile,
  sliceName = "tile",
  actions,
  columns,
  onClick,
}: ModelProps<"tile", fetch.LightTile>) => {
  const imageClassName =
    "block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[190px] max-w-[190px]";
  return (
    <DataItem
      className={twMerge("", className)}
      onClick={() => onClick?.(tile)}
      title={tile.id}
      model={tile}
      sliceName={sliceName}
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

export const World = ({ className, tile, actions, columns }: ModelProps<"tile", fetch.LightTile>) => {
  const bottom = loader.load(tile.bottom?.url ?? "");
  const wall = tile.wall && loader.load(tile.wall.url);
  const top = tile.top && loader.load(tile.top.url);
  const lighting = tile.lighting && loader.load(tile.lighting?.url);
  const position = new Vector3(...tile.center, 0);
  const mapLayerView = st.use.mapLayerView();
  const mapModal = st.ref((state) => state.mapModal);
  const mousePosition = st.ref((state) => state.mousePosition);

  Object.assign(bottom, { minFilter: NearestFilter, magFilter: NearestFilter });
  if (wall) Object.assign(wall, { minFilter: NearestFilter, magFilter: NearestFilter });
  if (top) Object.assign(top, { minFilter: NearestFilter, magFilter: NearestFilter });
  if (lighting)
    Object.assign(lighting, {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
    });

  return (
    <mesh
      position={position}
      // onClick={async ({ point }) => interaction && st.do[`clickPointerOn${Utils.capitalize(interaction)}`](point)}
      // onDoubleClick={() => mapModal !== "view" && st.do.editTile(tile.id)}
      // onPointerMove={(e) => interaction && st.do[`movePointerOn${Utils.capitalize(interaction)}`](e.point)}
    >
      <mesh
        renderOrder={-1}
        onClick={async ({ point }) => {
          mapModal.current &&
            mapModal.current !== "select" &&
            mousePosition.current === "map" &&
            // fetch.interactions.includes(mapModal.current as fetch.Interaction) &&
            st.do[`clickPointerOn${Utils.capitalize(mapModal.current)}`](point);
        }}
        onDoubleClick={() => {
          mousePosition.current === "map" && mapModal.current === "select" && st.do.editTile(tile.id);
        }}
        onPointerMove={(e) =>
          mapModal.current &&
          mapModal.current !== "select" &&
          mousePosition.current === "map" &&
          // fetch.interactions.includes(mapModal.current as fetch.Interaction) &&
          st.do[`movePointerOn${Utils.capitalize(mapModal.current)}`](e.point)
        }
      >
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
