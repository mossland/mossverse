"use client";
import { DataItem, fetch } from "@shared/client";
import { ModelProps } from "@util/client";

export const Admin = ({ file, sliceName = "file", actions, columns }: ModelProps<"file", fetch.LightFile>) => {
  return (
    <DataItem
      title={`${file.filename}-${file.createdAt}`}
      model={file}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
