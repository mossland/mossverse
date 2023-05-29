"use client";
import * as Token from "./_client";
import { AiOutlineFileDone } from "react-icons/ai";
import { DataDashboard, fetch } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";

export const Menu: DataMenuItem = {
  key: "token",
  label: "Token",
  icon: <AiOutlineFileDone />,
  render: () => <Token.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "token",
  queryMap = fetch.tokenQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.TokenSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalToken"]}
      hidePresents={hidePresents}
    />
  );
};
