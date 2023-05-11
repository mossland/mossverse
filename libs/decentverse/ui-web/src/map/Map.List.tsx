import { SketchOutlined } from "@ant-design/icons";
import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { DataEditModal, DataListContainer, DataTableList } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap } from "@shared/util-client";
import * as Map from ".";

export const MapList = ({ slice = st.slice.map, init }: ModelsProps<slice.MapSlice, gql.Map>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      renderItem={Map.Item}
      renderDashboard={Map.Stat}
      queryMap={gql.mapQueryMap}
      edit={
        <DataEditModal slice={slice} renderTitle={(map: DefaultOf<gql.Map>) => `${map.name}`}>
          <Map.Edit slice={slice} />
        </DataEditModal>
      }
      columns={["type", "status", "createdAt"]}
      actions={(map: gql.LightMap, idx) => [
        "remove",
        "edit",
        { type: "mapEditor", onClick: () => slice.do.viewMap(map.id), render: () => <SketchOutlined /> },
      ]}
    />
  );
};
