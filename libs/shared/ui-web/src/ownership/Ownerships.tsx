import { st, gql, slice } from "@shared/data-access";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "../index";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";
import { OneToOneOutlined } from "@ant-design/icons";

export const OwnershipMenuItem: DataMenuItem = {
  key: "ownership",
  label: "Ownership",
  icon: <OneToOneOutlined />,
  render: () => <Ownerships />,
};

export const Ownerships = ({ slice = st.slice.ownership, init }: ModelsProps<slice.OwnershipSlice, gql.Ownership>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      edit={<OwnershipEdit slice={slice} />}
      renderItem={Ownership}
      // columns={["id"]}
      actions={["edit"]}
    />
  );
};
export const Ownership = ({
  ownership,
  slice = st.slice.ownership,
  actions,
  columns,
}: ModelProps<slice.OwnershipSlice, gql.LightOwnership>) => {
  return <DataItem title={ownership.id} model={ownership} slice={slice} actions={actions} columns={columns} />;
};

export const OwnershipEdit = ({ slice }: ModelEditProps<slice.OwnershipSlice>) => {
  const ownershipForm = slice.use.ownershipForm();
  return (
    <DataEditModal slice={slice} renderTitle={(ownership: DefaultOf<gql.Ownership>) => `${ownership.id}`}>
      {/* <Field.Text label="Code" value={ownershipForm.code} onChange={slice.do.setCodeOnOwnership} />
      <Field.Number label="Num" value={ownershipForm.num} onChange={slice.do.setNumOnOwnership} /> */}
    </DataEditModal>
  );
};
