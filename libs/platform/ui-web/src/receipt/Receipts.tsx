import { AccountBookOutlined } from "@ant-design/icons";
import { gql, st, slice } from "@platform/data-access";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "@shared/ui-web";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";

export const ReceiptMenuItem: DataMenuItem = {
  key: "receipt",
  label: "Receipt",
  icon: <AccountBookOutlined />,
  render: () => <Receipts />,
};
export const Receipts = ({ slice = st.slice.receipt, init }: ModelsProps<slice.ReceiptSlice, gql.Receipt>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      // edit={<ReceiptEdit slice={slice} />}
      renderItem={Receipt}
      columns={["name"]}
      actions={["edit"]}
    />
  );
};
export const Receipt = ({
  receipt,
  slice = st.slice.receipt,
  actions,
  columns,
}: ModelProps<slice.ReceiptSlice, gql.LightReceipt>) => {
  return <DataItem title={receipt.name} model={receipt} slice={slice} actions={actions} columns={columns} />;
};
