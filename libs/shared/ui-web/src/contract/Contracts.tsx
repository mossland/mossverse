import { gql, st, slice, useLocale } from "@shared/data-access";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "../index";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";
import { AuditOutlined } from "@ant-design/icons";

export const ContractMenuItem: DataMenuItem = {
  key: "contract",
  label: "Contract",
  icon: <AuditOutlined />,
  render: () => <Contracts />,
};

export const Contracts = ({ slice = st.slice.contract, init }: ModelsProps<slice.ContractSlice, gql.Contract>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      edit={<ContractEdit slice={slice} />}
      renderItem={Contract}
      columns={["address"]}
      actions={["edit"]}
    />
  );
};
export const Contract = ({
  contract,
  slice = st.slice.contract,
  actions,
  columns,
}: ModelProps<slice.ContractSlice, gql.LightContract>) => {
  return (
    <DataItem
      title={contract.displayName ?? contract.address}
      model={contract}
      slice={slice}
      actions={actions}
      columns={columns}
    />
  );
};

export const ContractEdit = ({ slice }: ModelEditProps<slice.ContractSlice>) => {
  const contractForm = slice.use.contractForm();
  const { l } = useLocale();

  return (
    <DataEditModal slice={slice} renderTitle={(contract: DefaultOf<gql.Contract>) => `${contract.name}`}>
      <Field.Parent
        label={l("contract.network")}
        slice={st.slice.network}
        value={contractForm.network}
        onChange={(network) => slice.do.setNetworkOnContract(network)}
        renderOption={(network) => `${network.name}/${network.provider}/${network.type}`}
      />
      <Field.Text
        label={l("contract.address")}
        value={contractForm.address}
        onChange={slice.do.setAddressOnContract}
        disabled={!!contractForm.id}
      />
      <Field.Text
        label={l("contract.name")}
        value={contractForm.displayName}
        onChange={slice.do.setDisplayNameOnContract}
      />
    </DataEditModal>
  );
};
