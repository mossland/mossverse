import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { DataItem } from "@shared/ui-web";
import { ModelProps } from "@shared/util-client";
import { memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { Vector3 } from "three";
import { AreaBox } from "../common";

export const WebviewItem = ({
  className,
  webview,
  slice = st.slice.webview,
  actions,
  columns,
}: ModelProps<slice.WebviewSlice, gql.LightWebview>) => {
  return (
    <DataItem className={className} title={`Webview`} model={webview} slice={slice} actions={actions} columns={columns}>
      <AreaBox color="#6666FF" wh={webview.wh} center={webview.center} />
      <div>Purpose: {webview.purpose}</div>
      <div>URL: {webview.url}</div>
      <div>Embed: {webview.isEmbed.toString()}</div>
    </DataItem>
  );
};

const WebviewItemWorld = memo(
  ({
    className,
    webview,
    slice = st.slice.webview,
    actions,
    columns,
  }: ModelProps<slice.WebviewSlice, gql.LightWebview>) => {
    const position = useMemo(() => new Vector3(...webview.center, 0), []);
    const mapModal = st.use.mapModal();
    const mapLayerView = st.use.mapLayerView();
    return (
      <mesh
        position={position}
        onClick={() => mapModal === "select" && slice.do.selectWebview(webview, { refresh: true })}
      >
        {mapLayerView.webview && <planeGeometry args={webview.wh} />}
        <meshBasicMaterial color="#6666FF" opacity={0.5} transparent />
      </mesh>
    );
  }
);

WebviewItem.World = WebviewItemWorld;
