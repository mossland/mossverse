"use client";
import * as Teleport from "./_client";
import { AiOutlineWarning } from "react-icons/ai";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { fetch } from "@decentverse/client";

export const TeleportMenu: DataMenuItem = {
  key: "teleport",
  label: "Teleport",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <Teleport.Zone.Admin />,
};

export const TeleportStat = ({
  className,
  summary,
  sliceName = "teleport",
  queryMap = fetch.teleportQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.TeleportSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalTeleport"]}
      hidePresents={hidePresents}
    />
  );
};
