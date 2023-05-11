import { st, gql, slice, useLocale } from "@shared/data-access";
import { cnst, Utils } from "@shared/util";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "../index";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";
import { RadarChartOutlined } from "@ant-design/icons";

export const NetworkMenuItem: DataMenuItem = {
  key: "network",
  label: "Network",
  icon: <RadarChartOutlined />,
  render: () => <Networks />,
};
export const Networks = ({ slice = st.slice.network, init }: ModelsProps<slice.NetworkSlice, gql.Network>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      edit={<NetworkEdit slice={slice} />}
      renderItem={Network}
      columns={["name", "networkId", "provider", "type"]}
      actions={["edit"]}
    />
  );
};
export const Network = ({
  network,
  slice = st.slice.network,
  actions,
  columns,
}: ModelProps<slice.NetworkSlice, gql.LightNetwork>) => {
  return <DataItem title={network.name} model={network} slice={slice} actions={actions} columns={columns} />;
};

export const NetworkEdit = ({ slice }: ModelEditProps<slice.NetworkSlice>) => {
  const { l } = useLocale();
  const networkForm = slice.use.networkForm();

  return (
    <DataEditModal slice={slice} renderTitle={(network: DefaultOf<gql.Network>) => `${network.name}`}>
      <Field.Text label={l("network.name")} value={networkForm.name} onChange={slice.do.setNameOnNetwork} />
      <Field.SelectItem
        label={l("network.provider")}
        items={cnst.networkProviders}
        value={networkForm.provider}
        onChange={slice.do.setProviderOnNetwork}
        disabled={!!networkForm.id}
      />
      <Field.SelectItem
        label={l("network.type")}
        items={cnst.networkTypes}
        value={networkForm.type}
        onChange={slice.do.setTypeOnNetwork}
      />
      <Field.Number
        label={l("network.networkId")}
        value={networkForm.networkId}
        onChange={slice.do.setNetworkIdOnNetwork}
      />
      <Field.Text
        label={l("network.endPoint")}
        value={networkForm.endPoint}
        onChange={slice.do.setEndPointOnNetwork}
        disabled={!!networkForm.id}
      />
    </DataEditModal>
  );
};
