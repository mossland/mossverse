import { BranchesOutlined } from "@ant-design/icons";
import { gql, st, slice } from "@platform/data-access";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "@shared/ui-web";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";

export const SnapshotMenuItem: DataMenuItem = {
  key: "snapshot",
  label: "Snapshot",
  icon: <BranchesOutlined />,
  render: () => <Snapshots />,
};
export const Snapshots = ({ slice = st.slice.snapshot, init }: ModelsProps<slice.SnapshotSlice, gql.Snapshot>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      edit={<SnapshotEdit slice={slice} />}
      renderItem={Snapshot}
      columns={["id"]}
      actions={["edit"]}
    />
  );
};
export const Snapshot = ({
  snapshot,
  slice = st.slice.snapshot,
  actions,
  columns,
}: ModelProps<slice.SnapshotSlice, gql.LightSnapshot>) => {
  return <DataItem title={snapshot.id} model={snapshot} slice={slice} actions={actions} columns={columns} />;
};

export const SnapshotEdit = ({ slice }: ModelEditProps<slice.SnapshotSlice>) => {
  const snapshotForm = slice.use.snapshotForm();
  return (
    <DataEditModal slice={slice} renderTitle={(snapshot: DefaultOf<gql.Snapshot>) => `${snapshot.id}`}>
      {/* <Field.Text label="Code" value={snapshotForm.code} onChange={slice.do.setCodeOnSnapshot} />
      <Field.Number label="Num" value={snapshotForm.num} onChange={slice.do.setNumOnSnapshot} /> */}
    </DataEditModal>
  );
};
