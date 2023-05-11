import { DeleteOutlined, PlusOutlined, ScheduleOutlined } from "@ant-design/icons";
import { st, gql, slice } from "@platform/data-access";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "@shared/ui-web";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";

export const ShipInfoMenuItem: DataMenuItem = {
  key: "shipInfo",
  label: "ShipInfo",
  icon: <ScheduleOutlined />,
  render: () => <ShipInfos />,
};

export const ShipInfos = ({ slice = st.slice.shipInfo, init }: ModelsProps<slice.ShipInfoSlice, gql.ShipInfo>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      edit={<ShipInfoEdit slice={slice} />}
      queryMap={gql.shipInfoQueryMap}
      //  renderDashboard={ShipInfoDashboard}
      renderItem={ShipInfo}
      columns={["id", "status"]}
      actions={["edit", "remove"]}
    />
  );
};
export const ShipInfo = ({
  shipInfo,
  slice = st.slice.shipInfo,
  actions,
  columns,
}: ModelProps<slice.ShipInfoSlice, gql.LightShipInfo>) => {
  return (
    <DataItem title={`ShipInfo ${shipInfo.id}`} model={shipInfo} slice={slice} actions={actions} columns={columns} />
  );
};

export const ShipInfoEdit = ({ slice }: ModelEditProps<slice.ShipInfoSlice>) => {
  const shipInfoForm = slice.use.shipInfoForm();
  return (
    <DataEditModal
      slice={slice}
      renderTitle={(shipInfo: DefaultOf<gql.ShipInfo>) => `${shipInfo.id ?? "New"}`}
    ></DataEditModal>
  );
};
