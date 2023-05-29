"use client";
import * as File from "./_client";
import { DataListContainer, fetch } from "@shared/client";
import { ModelsProps } from "@util/client";

export const Admin = ({ sliceName = "file", init }: ModelsProps<fetch.File>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={File.Unit.Admin}
      renderDashboard={File.Util.Stat}
      queryMap={fetch.fileQueryMap}
      type="list"
      columns={["filename", "createdAt", "status"]}
      actions={(file: fetch.LightFile, idx) => ["remove", "view"]}
    />
  );
};
