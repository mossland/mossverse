"use client";
import * as Trade from "./_client";
import { AiOutlineNodeIndex } from "react-icons/ai";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { fetch } from "@platform/client";

export const Menu: DataMenuItem = {
  key: "trade",
  label: "Trade",
  icon: <AiOutlineNodeIndex />,
  render: () => <Trade.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "trade",
  hidePresents,
}: ModelDashboardProps<fetch.TradeSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={fetch.tradeQueryMap}
      columns={["totalTrade"]}
      hidePresents={hidePresents}
    />
  );
};
