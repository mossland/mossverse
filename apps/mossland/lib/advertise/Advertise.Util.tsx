"use client";
import * as Advertise from "./_client";
import { AiOutlineWarning } from "react-icons/ai";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { fetch } from "@mossland/client";

export const Menu: DataMenuItem = {
  key: "advertise",
  label: "Advertise",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <Advertise.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "advertise",
  queryMap = fetch.advertiseQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.AdvertiseSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalAdvertise"]}
      hidePresents={hidePresents}
    />
  );
};
