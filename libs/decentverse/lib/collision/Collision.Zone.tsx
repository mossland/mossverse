"use client";
import * as Collision from "./_client";
import { LoadUnits } from "@shared/client";
import { ModelsProps, ServerInit } from "@util/client";
import { fetch, st } from "@decentverse/client";
import { useEffect } from "react";

export const Admin = ({ sliceName = "collision", init }: ModelsProps<fetch.Collision>) => {
  const collisionMap = st.use.collisionMap();
  useEffect(() => {
    init && st.do.initCollision(init);
  }, [init]);
  return (
    <>
      {(collisionMap === "loading" ? [] : [...collisionMap.values()]).map((collision) => (
        <Collision.Unit.Admin key={collision.id} collision={collision} />
      ))}
    </>
  );
};

interface WorldProps {
  init: ServerInit<"collision", fetch.LightCollision>;
}
export const World = ({ init }: WorldProps) => {
  return (
    <LoadUnits
      noDiv
      init={init}
      renderItem={(collision: fetch.LightCollision) => <Collision.Unit.World key={collision.id} collision={collision} />}
    />
  );
};
