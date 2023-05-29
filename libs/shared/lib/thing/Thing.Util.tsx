"use client";
import * as Thing from "./_client";
import { AiOutlineFileExcel } from "react-icons/ai";
import { DataDashboard, fetch } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";

export const Menu: DataMenuItem = {
  key: "thing",
  label: "Thing",
  icon: <AiOutlineFileExcel />,
  render: () => <Thing.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "thing",
  queryMap = fetch.thingQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.ThingSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalThing"]}
      hidePresents={hidePresents}
    />
  );
};
