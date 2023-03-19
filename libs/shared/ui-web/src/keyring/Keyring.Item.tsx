import { st, gql, slice } from "@shared/data-access";
import { DataItem } from "@shared/ui-web";
import { ModelProps } from "@shared/util-client";

export const KeyringItem = ({
  keyring,
  slice = st.slice.keyring,
  actions,
  columns,
}: ModelProps<slice.KeyringSlice, gql.LightKeyring>) => {
  return <DataItem title={`${keyring.id}`} model={keyring} slice={slice} actions={actions} columns={columns} />;
};
