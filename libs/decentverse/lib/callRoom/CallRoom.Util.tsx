"use client";
import * as CallRoom from "./_client";
import { AiOutlineWarning } from "react-icons/ai";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { fetch } from "@decentverse/client";

export const Menu: DataMenuItem = {
  key: "callRoom",
  label: "CallRoom",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <CallRoom.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "callRoom",
  queryMap = fetch.callRoomQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.CallRoomSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalCallRoom"]}
      hidePresents={hidePresents}
    />
  );
};
