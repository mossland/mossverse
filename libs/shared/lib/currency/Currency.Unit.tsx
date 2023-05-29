"use client";
import { DataItem, fetch } from "@shared/client";
import { ModelProps } from "@util/client";

export const Admin = ({
  className,
  currency,
  sliceName = "currency",
  actions,
  columns,
}: ModelProps<"currency", fetch.LightCurrency>) => {
  return (
    <DataItem
      className={className}
      title={`${currency.name}`}
      model={currency}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
