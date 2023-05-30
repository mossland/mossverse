"use client";
import { DataItem, fetch } from "@shared/client";
import { ModelProps } from "@util/client";

export const Admin = ({
  className,
  network,
  sliceName = "network",
  actions,
  columns,
}: ModelProps<"network", fetch.LightNetwork>) => {
  return (
    <DataItem
      className={className}
      title={`${network.name}`}
      model={network}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
