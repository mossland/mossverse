"use client";
import { DataItem, fetch } from "@shared/client";
import { ModelProps } from "@util/client";

export const Admin = ({
  className,
  contract,
  sliceName = "contract",
  actions,
  columns,
}: ModelProps<"contract", fetch.LightContract>) => {
  return (
    <DataItem
      className={className}
      title={contract.displayName ?? contract.address}
      model={contract}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
