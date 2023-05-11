import { DeleteOutlined } from "@ant-design/icons";
import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { DataItem, Img } from "@shared/ui-web";
import { ModelProps } from "@shared/util-client";
import { Button, Card } from "antd";
import { memo } from "react";
import { twMerge } from "tailwind-merge";

export const AssetItem = ({
  className,
  asset,
  slice = st.slice.asset,
  actions,
  onClick,
  columns,
}: ModelProps<slice.AssetSlice, gql.LightAsset>) => {
  const imageClassName = "block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 object-contain";
  return (
    <DataItem
      className={twMerge("", className)}
      onClick={() => onClick?.(asset)}
      title={asset.name}
      model={asset}
      slice={slice}
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
