"use client";
import * as Map from "./_client";
import { AiOutlineSketch } from "react-icons/ai";
import { DataEditModal, DataListContainer, Link, LoadView } from "@shared/client";
import { DefaultOf, ModelsProps, ServerView } from "@util/client";
import { fetch, st } from "@decentverse/client";
import { useEffect } from "react";

export const Admin = ({ sliceName = "map", init }: ModelsProps<fetch.Map>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Map.Unit.Admin}
      renderDashboard={Map.Util.Stat}
      queryMap={fetch.mapQueryMap}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(map: DefaultOf<fetch.Map>) => `${map.name}`}>
          <Map.Edit.General />
        </DataEditModal>
      }
      columns={["type", "status", "createdAt"]}
      actions={(map: fetch.LightMap, idx) => [
        "remove",
        "edit",
        {
          type: "mapEditor",
          onClick: () => st.do.viewMap(map.id),
          render: () => <AiOutlineSketch />,
        },
      ]}
    />
  );
};

export const Editor = ({ sliceName = "map", init }: ModelsProps<fetch.Map>) => {
  const mapMap = st.use.mapMap();
  useEffect(() => {
    st.do.initMap({ limit: 0 });
  }, []);
  return (
    <div className="flex">
      <div
        className="flex items-center p-4 m-4 align-middle border cursor-pointer bg-white/50"
        onClick={() => st.do.newMap()}
      >
        {" "}
        + New Map
      </div>
      <div className="flex gap-12 mt-12 ml-12">
        {mapMap === "loading"
          ? []
          : [...mapMap.values()].map((map: fetch.LightMap) => (
              <div key={map.id}>
                <Link href={`/admin/map/${map.id}/edit`}>
                  <Map.Unit.Admin map={map} />
                </Link>
                <button onClick={() => st.do.editMap(map.id)}>edit</button>
              </div>
            ))}
      </div>
      <DataEditModal sliceName="map">
        <Map.Edit.General />
      </DataEditModal>
    </div>
  );
};

interface WorldEnvironmentsProps {
  view: ServerView<"map", fetch.Map>;
}
export const WorldEnvironments = ({ view }: WorldEnvironmentsProps) => {
  return (
    <LoadView
      noDiv
      view={view}
      renderView={(map) => <Map.Util.Daylight wh={map.wh} dayNight={map.config.dayNight} />}
    />
  );
};
