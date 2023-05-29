"use client";
import * as Asset from "./_client";
import { AiOutlineWarning } from "react-icons/ai";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { fetch } from "@decentverse/client";

export const Menu: DataMenuItem = {
  key: "asset",
  label: "Asset",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <Asset.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "asset",
  queryMap = fetch.assetQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.AssetSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalAsset"]}
      hidePresents={hidePresents}
    />
  );
};
