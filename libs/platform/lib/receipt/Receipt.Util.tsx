"use client";
import { AiOutlineAccountBook } from "react-icons/ai";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { Receipt } from "../../client";
import { fetch } from "@platform/client";

export const Menu: DataMenuItem = {
  key: "receipt",
  label: "Receipt",
  icon: <AiOutlineAccountBook />,
  render: () => <Receipt.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "receipt",
  queryMap = fetch.receiptQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.ReceiptSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalReceipt"]}
      hidePresents={hidePresents}
    />
  );
};
