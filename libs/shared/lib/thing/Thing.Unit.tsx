"use client";
import { DataItem, fetch } from "@shared/client";
import { ModelProps } from "@util/client";

export const Admin = ({
  className,
  thing,
  sliceName = "thing",
  actions,
  columns,
}: ModelProps<"thing", fetch.LightThing>) => {
  return (
    <DataItem
      className={className}
      title={`${thing.name}`}
      model={thing}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
