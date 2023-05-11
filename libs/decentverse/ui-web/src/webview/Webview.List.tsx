import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { DataEditModal, DataListContainer, DataTableList, LoadItems } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap, useInterval } from "@shared/util-client";
import * as Webview from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";
import { Utils } from "@shared/util";
import { useEffect } from "react";

export const WebviewList = ({ slice = st.slice.webview, init }: ModelsProps<slice.WebviewSlice, gql.Webview>) => {
  return (
    <LoadItems
      slice={slice}
      init={init}
      renderItem={(webview: gql.LightWebview, idx) => <Webview.Item slice={slice} webview={webview} idx={idx} />}
    />
  );
};

const WebviewListWorld = ({ slice = st.slice.webview, init }: ModelsProps<slice.WebviewSlice, gql.Webview>) => {
  const webview = slice.use.webview();
  const webviewList = slice.use.webviewList();
  const playerPosition = st.ref((state) => state.playerPosition);
  const webviewModal = slice.use.webviewModal();
  useInterval(() => {
    if (webviewList === "loading") return;
    if (webview !== "loading") {
      if (Utils.isInside(playerPosition.current, webview)) return;
      else webviewModal !== "edit" && slice.do.resetWebview();
    } else {
      for (const webview of webviewList) {
        if (!Utils.isInside(playerPosition.current, webview)) continue;
        slice.do.viewWebview(webview.id, { modal: "join" });
      }
    }
  }, 200);
  return (
    <>
      <LoadItems
        noDiv
        slice={slice}
        init={init}
        loading={null}
        renderItem={(webview: gql.LightWebview, idx) => (
          <Webview.Item.World key={webview.id} slice={slice} webview={webview} idx={idx} />
        )}
      />
      {webview === "loading" || webviewModal !== "join" ? null : <Webview.Action.Guide webview={webview} />}
    </>
  );
};

WebviewList.World = WebviewListWorld;
