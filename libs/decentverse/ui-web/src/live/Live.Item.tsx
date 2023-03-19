import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { Html } from "@react-three/drei";
import { DataItem } from "@shared/ui-web";
import { ModelProps } from "@shared/util-client";
import { memo } from "react";
import { isMobile } from "react-device-detect";
import { twMerge } from "tailwind-merge";
import { Vector3 } from "three";
import { AreaBox } from "../common";

export const LiveItem = ({
  className,
  live,
  slice = st.slice.live,
  actions,
  columns,
}: ModelProps<slice.LiveSlice, gql.LightLive>) => {
  return (
    <DataItem className={className} title={`Live`} model={live} slice={slice} actions={actions} columns={columns}>
      <AreaBox color="#D96704" wh={live.wh} center={live.center} />
      <div>Src: {live.src}</div>
    </DataItem>
  );
};

const LiveItemWorld = memo(
  ({ className, live, slice = st.slice.live, actions, columns }: ModelProps<slice.LiveSlice, gql.LightLive>) => {
    const position = new Vector3(...live.center, 0.1);
    const scale = isMobile ? 0.6 : 1;
    const [width, height] = [live.wh[0] * scale, live.wh[1] * scale];
    const mapLayerView = st.use.mapLayerView();
    const mapModal = st.use.mapModal();
    return (
      <mesh position={position} onClick={() => mapModal === "select" && slice.do.selectLive(live, { refresh: true })}>
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
  }
);
LiveItem.World = LiveItemWorld;
