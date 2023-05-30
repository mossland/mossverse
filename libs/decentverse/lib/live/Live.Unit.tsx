"use client";
import { AreaBox } from "../../client";
import { BiX } from "react-icons/bi";
import { DataItem } from "@shared/client";
import { Html } from "@react-three/drei";
import { ModelProps } from "@util/client";
import { Vector3 } from "three";
import { fetch, st } from "@decentverse/client";
import { isMobile } from "react-device-detect";
import { memo } from "react";

export const Admin = ({
  className,
  live,
  sliceName = "live",
  actions,
  columns,
}: ModelProps<"live", fetch.LightLive>) => {
  return (
    <DataItem
      className={className}
      title={`Live`}
      model={live}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    >
      <button onClick={() => st.do.selectLive(live, { remove: true })} className="absolute top-0 right-0 m-5">
        <BiX />
      </button>
      <AreaBox color="#D96704" wh={live.wh} center={live.center} />
      <div>Src: {live.src}</div>
    </DataItem>
  );
};

export const World = memo(({ className, live }: ModelProps<"live", fetch.LightLive>) => {
  const position = new Vector3(...live.center, 0.1);
  const scale = isMobile ? 0.6 : 1;
  const [width, height] = [live.wh[0] * scale, live.wh[1] * scale];
  const mapLayerView = st.use.mapLayerView();
  const mapModal = st.use.mapModal();
  return (
    <mesh position={position} onClick={() => mapModal === "select" && st.do.selectLive(live, { refresh: true })}>
      {mapLayerView.live.iframe && (
        <>
          <planeGeometry args={live.wh} />
          <meshBasicMaterial color="#D96704" opacity={0.5} transparent />
        </>
      )}
      {mapLayerView.live.iframe && (
        <Html as="div" center zIndexRange={[-10, 0]}>
          <iframe
            title={live.id}
            style={{ width, height }}
            // src={live.src}
            src={"https://www.youtube.com/embed/e7Ary2grhNI"}
            allow="autoplay; muted encrypted-media"
          />
        </Html>
      )}
    </mesh>
  );
});
