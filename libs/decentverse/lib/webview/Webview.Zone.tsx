"use client";
import * as Webview from "./_client";
import { LoadUnits } from "@shared/client";
import { ModelsProps, ServerInit, useInterval } from "@util/client";
import { Utils } from "@util/client";
import { fetch, st } from "@decentverse/client";
import { useEffect } from "react";

export const Admin = ({ sliceName = "webview", init }: ModelsProps<fetch.Webview>) => {
  const webviewMap = st.use.webviewMap();
  useEffect(() => {
    init && st.do.initWebview(init);
  }, [init]);
  return (
    <>
      {(webviewMap === "loading" ? [] : [...webviewMap.values()]).map((webview) => (
        <Webview.Unit.Admin key={webview.id} webview={webview} />
      ))}
    </>
  );
};

interface WorldProps {
  init: ServerInit<"webview", fetch.LightWebview>;
}
export const World = ({ init }: WorldProps) => {
  const webview = st.use.webview();
  const webviewMap = st.use.webviewMap();
  const playerPosition = st.ref((state) => state.playerPosition);
  const webviewModal = st.use.webviewModal();
  useInterval(() => {
    if (webviewMap === "loading") return;
    if (webview !== "loading") {
      if (Utils.isInside(playerPosition.current, webview)) return;
      else webviewModal !== "edit" && st.do.resetWebview();
    } else {
      for (const webview of [...webviewMap.values()]) {
        if (!Utils.isInside(playerPosition.current, webview)) continue;
        st.do.viewWebview(webview.id, { modal: "join" });
      }
    }
  }, 200);
  return (
    <>
      <LoadUnits
        noDiv
        init={init}
        renderItem={(webview: fetch.LightWebview) => <Webview.Unit.World key={webview.id} webview={webview} />}
      />
      {webview === "loading" || webviewModal !== "join" ? null : <Webview.Util.Guide webview={webview} />}
    </>
  );
};
