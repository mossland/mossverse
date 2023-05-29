"use client";
import * as Network from "./_client";
import { AiOutlineRadarChart } from "react-icons/ai";
import { DataDashboard, fetch } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";

export const Menu: DataMenuItem = {
  key: "network",
  label: "Network",
  icon: <AiOutlineRadarChart />,
  render: () => <Network.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "network",
  queryMap = fetch.networkQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.NetworkSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalNetwork"]}
      hidePresents={hidePresents}
    />
  );
};
