"use client";
import * as Notification from "./_client";
import { AiOutlineSchedule } from "react-icons/ai";
import { DataDashboard, fetch } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";

export const Menu: DataMenuItem = {
  key: "notification",
  label: "Notification",
  icon: <AiOutlineSchedule />,
  render: () => <Notification.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "notification",
  queryMap = fetch.notificationQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.NotificationSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalNotification"]}
      hidePresents={hidePresents}
    />
  );
};
