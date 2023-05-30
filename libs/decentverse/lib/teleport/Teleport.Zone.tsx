"use client";
import * as Teleport from "./_client";
import { LoadUnits } from "@shared/client";
import { ModelsProps, ServerInit, useInterval } from "@util/client";
import { Utils } from "@util/client";
import { fetch, st } from "@decentverse/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const Admin = ({ sliceName = "teleport", init }: ModelsProps<fetch.Teleport>) => {
  const teleportMap = st.use.teleportMap();
  useEffect(() => {
    init && st.do.initTeleport(init);
  }, [init]);
  return (
    <>
      {(teleportMap === "loading" ? [] : [...teleportMap.values()]).map((teleport) => (
        <Teleport.Unit.Admin key={teleport.id} teleport={teleport} />
      ))}
    </>
  );
};

interface WorldProps {
  init: ServerInit<"teleport", fetch.LightTeleport>;
  onJoin?: (teleport: fetch.Teleport) => void;
  onLeave?: (teleport: fetch.Teleport) => void;
}
export const World = ({ init, onJoin, onLeave }: WorldProps) => {
  const router = useRouter();
  const teleport = st.use.teleport();
  const teleportMap = st.use.teleportMap();
  const playerPosition = st.ref((state) => state.playerPosition);
  const teleportModal = st.use.teleportModal();
  useInterval(() => {
    if (teleportMap === "loading") return;
    for (const teleport of [...teleportMap.values()])
      if (Utils.isInside(playerPosition.current, teleport)) router.replace(teleport.href);
  }, 200);
  useEffect(() => {
    if (teleport === "loading" || teleportModal !== "join") return;
    onJoin?.(teleport);
    return () => {
      onLeave?.(teleport);
    };
  }, [teleport, onJoin, onLeave, teleportModal]);
  return (
    <LoadUnits
      noDiv
      init={init}
      renderItem={(teleport: fetch.LightTeleport) => <Teleport.Unit.World key={teleport.id} teleport={teleport} />}
    />
  );
};
