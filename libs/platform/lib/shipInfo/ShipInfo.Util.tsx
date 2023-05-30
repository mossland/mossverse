"use client";
import * as ShipInfo from "./_client";
import { AiOutlineWarning } from "react-icons/ai";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { fetch } from "@platform/client";

export const Menu: DataMenuItem = {
  key: "shipInfo",
  label: "ShipInfo",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <ShipInfo.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "shipInfo",
  queryMap = fetch.shipInfoQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.ShipInfoSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalShipInfo"]}
      hidePresents={hidePresents}
    />
  );
};
