"use client";
import { DataItem, fetch } from "@shared/client";
import { ModelProps } from "@util/client";

export const Admin = ({
  className,
  wallet,
  sliceName = "wallet",
  actions,
  columns,
}: ModelProps<"wallet", fetch.LightWallet>) => {
  return (
    <DataItem
      className={className}
      title={`${wallet.id}`}
      model={wallet}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
