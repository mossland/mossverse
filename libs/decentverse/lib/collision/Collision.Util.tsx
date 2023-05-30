"use client";
import * as Collision from "./_client";
import { AiOutlineWarning } from "react-icons/ai";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { fetch } from "@decentverse/client";

export const Menu: DataMenuItem = {
  key: "collision",
  label: "Collision",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <Collision.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "collision",
  queryMap = fetch.collisionQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.CollisionSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalCollision"]}
      hidePresents={hidePresents}
    />
  );
};
