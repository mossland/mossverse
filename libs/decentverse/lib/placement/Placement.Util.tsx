"use client";
import * as Placement from "./_client";
import { AiOutlineWarning } from "react-icons/ai";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { fetch } from "@decentverse/client";

export const Menu: DataMenuItem = {
  key: "placement",
  label: "Placement",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <Placement.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "placement",
  queryMap = fetch.placementQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.PlacementSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalPlacement"]}
      hidePresents={hidePresents}
    />
  );
};
