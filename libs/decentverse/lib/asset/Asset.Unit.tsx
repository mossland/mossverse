"use client";
import { DataItem } from "@shared/client";
import { ModelProps } from "@util/client";
import { fetch } from "@decentverse/client";
import { twMerge } from "tailwind-merge";

export const Admin = ({
  className,
  asset,
  sliceName = "asset",
  actions,
  onClick,
  columns,
}: ModelProps<"asset", fetch.LightAsset>) => {
  const imageClassName = "block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 object-contain";
  return (
    <DataItem
      className={twMerge("", className)}
      onClick={() => onClick?.(asset)}
      title={asset.name}
      model={asset}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    >
      <div className={`relative h-full cursor-pointer`}>
        {asset.bottom?.url && <img className={imageClassName} alt="bottom" src={asset.bottom.url} />}
        {asset.wall?.url && <img className={imageClassName} alt="wall" src={asset.wall.url} />}
        {asset.top?.url && <img className={imageClassName} alt="top" src={asset.top.url} />}
        {asset.lighting?.url && <img className={imageClassName} alt="lighting" src={asset.lighting.url} />}
      </div>
    </DataItem>
  );
};
