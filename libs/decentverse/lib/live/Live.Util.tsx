"use client";
import * as Live from "./_client";
import { AiOutlineWarning } from "react-icons/ai";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { fetch } from "@decentverse/client";

export const Menu: DataMenuItem = {
  key: "live",
  label: "Live",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <Live.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "live",
  queryMap = fetch.liveQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.LiveSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalLive"]}
      hidePresents={hidePresents}
    />
  );
};
