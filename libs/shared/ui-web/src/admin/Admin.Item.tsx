import { st, gql, slice, useLocale } from "@shared/data-access";
import { DataItem } from "@shared/ui-web";
import { ModelProps } from "@shared/util-client";
import { twMerge } from "tailwind-merge";

export const AdminItem = ({
  className,
  admin,
  slice = st.slice.admin,
  actions,
  columns,
}: ModelProps<slice.AdminSlice, gql.LightAdmin>) => {
  return (
    <DataItem
      className={className}
      title={`${admin.accountId}`}
      model={admin}
      slice={slice}
      actions={actions}
      columns={columns}
    />
  );
};
