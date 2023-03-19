import { HeatMapOutlined, WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import { gql, st } from "@decentverse/data-access";
import * as Map from ".";
import { DataEditModal, LoadItems } from "@shared/ui-web";
import Router from "next/router";

export const MapMenu: DataMenuItem = {
  key: "map",
  label: "Map",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <Map.List />,
};

export const MapMenuEditor: DataMenuItem = {
  key: "mapEditor",
  label: "Map Editor",
  icon: <HeatMapOutlined />,
  render: () => (
    <div className="flex">
      <div
        className="border bg-white/50 p-4 flex items-center align-middle cursor-pointer m-4"
        onClick={() => st.do.newMap()}
      >
        {" "}
        + New Map
      </div>
      <LoadItems
        className="flex gap-12 ml-12 mt-12"
        init={{ limit: 0 }}
        slice={st.slice.map}
        renderItem={(map: gql.LightMap, idx) => (
          <div key={map.id}>
            <Map.Item map={map} idx={idx} onClick={() => Router.push(`/admin/map/${map.id}/edit`)} />
            <button onClick={() => st.do.editMap(map.id)}>edit</button>
          </div>
        )}
      />
      <DataEditModal slice={st.slice.map}>
        <Map.Edit />
      </DataEditModal>
    </div>
  ),
};
