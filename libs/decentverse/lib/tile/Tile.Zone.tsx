"use client";
import * as Tile from "./_client";
import { LoadUnits } from "@shared/client";
import { ModelsProps, ServerInit } from "@util/client";
import { fetch, st } from "@decentverse/client";
import { useEffect } from "react";

export const Admin = ({ sliceName = "tile", init }: ModelsProps<fetch.Tile>) => {
  const tileMap = st.use.tileMap();
  useEffect(() => {
    init && st.do.initTile(init);
  }, [init]);
  return (
    <>
      {(tileMap === "loading" ? [] : [...tileMap.values()]).map((tile) => (
        <Tile.Unit.Admin key={tile.id} tile={tile} />
      ))}
    </>
  );
};

interface WorldProps {
  init: ServerInit<"tile", fetch.LightTile>;
}
export const World = ({ init }: WorldProps) => {
  return (
    <LoadUnits noDiv init={init} renderItem={(tile: fetch.LightTile) => <Tile.Unit.World key={tile.id} tile={tile} />} />
  );
};
