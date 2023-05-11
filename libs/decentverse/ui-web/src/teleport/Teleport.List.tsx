import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { LoadItems } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap, useInterval } from "@shared/util-client";
import * as Teleport from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";
import { Overlay } from "../common/Overlay";
import { Utils } from "@shared/util";
import { useEffect } from "react";

export const TeleportList = ({ slice = st.slice.teleport, init }: ModelsProps<slice.TeleportSlice, gql.Teleport>) => {
  return (
    <LoadItems
      noDiv
      slice={slice}
      init={init}
      loading={null}
      renderItem={(teleport: gql.LightTeleport, idx) => <Teleport.Item slice={slice} teleport={teleport} idx={idx} />}
    />
  );
};

const TeleportListWorld = ({
  slice = st.slice.teleport,
  init,
  onJoin,
  onLeave,
}: ModelsProps<slice.TeleportSlice, gql.Teleport> & {
  onJoin?: (teleport: gql.Teleport) => void;
  onLeave?: (teleport: gql.Teleport) => void;
}) => {
  const teleport = slice.use.teleport();
  const teleportList = slice.use.teleportList();
  const playerPosition = st.ref((state) => state.playerPosition);
  const teleportModal = slice.use.teleportModal();
  //64089ecc6779e00cb846f6e8
  useInterval(() => {
    if (teleportList === "loading") return;
    for (const teleport of teleportList)
      if (Utils.isInside(playerPosition.current, teleport)) Router.replace(teleport.href);
  }, 200);
  useEffect(() => {
    if (teleport === "loading" || teleportModal !== "join") return;
    onJoin?.(teleport);
    return () => {
      onLeave?.(teleport);
    };
  }, [teleport, onJoin, onLeave, teleportModal]);
  return (
    <>
      <LoadItems
        noDiv
        slice={slice}
        init={init}
        loading={null}
        renderItem={(teleport: gql.LightTeleport, idx) => (
          <Teleport.Item.World key={teleport.id} slice={slice} teleport={teleport} idx={idx} />
        )}
      />
      {/* {teleport === "loading" || teleportModal !== "join" ? null : (
        <Overlay center={teleport.center} wh={teleport.wh} />
      )} */}
    </>
  );
};
TeleportList.World = TeleportListWorld;
