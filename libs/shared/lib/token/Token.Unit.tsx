"use client";
import { DataItem, Image, fetch } from "@shared/client";
import { ModelProps } from "@util/client";

export const Admin = ({
  className,
  token,
  sliceName = "token",
  actions,
  columns,
}: ModelProps<"token", fetch.LightToken>) => {
  return (
    <DataItem
      className={className}
      title={`${token.contract.displayName ?? token.contract.address} / ${token.tokenId ?? ""}`}
      cover={token.meta?.image ? <Image src={token.meta?.image} width={512} height={512} /> : null}
      model={token}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
