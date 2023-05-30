"use client";
import { AreaBox } from "../../client";
import { BiX } from "react-icons/bi";
import { DataItem } from "@shared/client";
import { ModelProps } from "@util/client";
import { Vector3 } from "three";
import { fetch, st } from "@decentverse/client";
import { memo, useMemo } from "react";

export const Admin = ({
  className,
  webview,
  sliceName = "webview",
  actions,
  columns,
}: ModelProps<"webview", fetch.LightWebview>) => {
  return (
    <DataItem
      className={className}
      title={`Webview`}
      model={webview}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    >
      <button onClick={() => st.do.selectWebview(webview, { remove: true })} className="absolute top-0 right-0 m-5">
        <BiX />
      </button>
      <AreaBox color="#6666FF" wh={webview.wh} center={webview.center} />
      <div>Purpose: {webview.purpose}</div>
      <div>URL: {webview.url}</div>
      <div>Embed: {webview.isEmbed.toString()}</div>
    </DataItem>
  );
};

export const World = memo(({ className, webview }: ModelProps<"webview", fetch.LightWebview>) => {
  const position = useMemo(() => new Vector3(...webview.center, 0), []);
  const mapModal = st.use.mapModal();
  const mapLayerView = st.use.mapLayerView();
  return (
    <mesh position={position} onClick={() => mapModal === "select" && st.do.selectWebview(webview, { refresh: true })}>
      {mapLayerView.webview && <planeGeometry args={webview.wh} />}
      <meshBasicMaterial color="#6666FF" opacity={0.5} transparent />
    </mesh>
  );
});
