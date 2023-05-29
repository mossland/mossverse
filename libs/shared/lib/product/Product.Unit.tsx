"use client";
import { DataItem, fetch } from "@shared/client";
import { ModelProps } from "@util/client";

export const Admin = ({
  className,
  product,
  sliceName = "product",
  actions,
  columns,
}: ModelProps<"product", fetch.LightProduct>) => {
  return (
    <DataItem
      className={className}
      title={`${product.name}`}
      model={product}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
