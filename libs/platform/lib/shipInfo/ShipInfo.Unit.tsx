"use client";
import { DataItem } from "@shared/client";
import { ModelProps } from "@util/client";
import { fetch } from "@platform/client";

export const Admin = ({
  className,
  shipInfo,
  sliceName = "shipInfo",
  actions,
  columns,
}: ModelProps<"shipInfo", fetch.LightShipInfo>) => {
  return (
    <DataItem
      className={className}
      title={`${shipInfo.id}`}
      model={shipInfo}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
