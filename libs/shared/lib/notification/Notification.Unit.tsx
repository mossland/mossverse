"use client";
import { DataItem, fetch } from "@shared/client";
import { ModelProps } from "@util/client";

export const Admin = ({
  className,
  notification,
  sliceName = "notification",
  actions,
  columns,
}: ModelProps<"notification", fetch.LightNotification>) => {
  return (
    <DataItem
      className={className}
      title={`${notification.id}`}
      model={notification}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
