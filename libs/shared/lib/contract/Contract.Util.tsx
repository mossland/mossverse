"use client";
import * as Contract from "./_client";
import { AiOutlineAudit } from "react-icons/ai";
import { DataDashboard } from "../_common";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { fetch } from "@shared/client";

export const Menu: DataMenuItem = {
  key: "contract",
  label: "Contract",
  icon: <AiOutlineAudit />,
  render: () => <Contract.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "contract",
  queryMap = fetch.contractQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.ContractSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalContract"]}
      hidePresents={hidePresents}
    />
  );
};
