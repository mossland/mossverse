"use client";
import { DataItem } from "@shared/client";
import { ModelProps } from "@util/client";
import { fetch } from "@mossland/client";

export const Admin = ({
  className,
  stakePool,
  sliceName = "stakePool",
  actions,
  columns,
}: ModelProps<"stakePool", fetch.LightStakePool>) => {
  return (
    <DataItem
      className={className}
      title={`${stakePool.type}-${stakePool.id}`}
      model={stakePool}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
