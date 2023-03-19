import { st, gql, slice, useLocale } from "@shared/data-access";
import { DataItem } from "@shared/ui-web";
import { ModelProps } from "@shared/util-client";

export const FileItem = ({
  file,
  slice = st.slice.file,
  actions,
  columns,
}: ModelProps<slice.FileSlice, gql.LightFile>) => {
  return (
    <DataItem
      title={`${file.filename}-${file.createdAt}`}
      model={file}
      slice={slice}
      actions={actions}
      columns={columns}
    />
  );
};
