"use client";
import { AiOutlineDollar } from "react-icons/ai";
import { Currency, DataDashboard, fetch } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";

export const Menu: DataMenuItem = {
  key: "currency",
  label: "Currency",
  icon: <AiOutlineDollar />,
  render: () => <Currency.Zone.Admin />,
};
export const Stat = ({
  className,
  summary,
  sliceName = "currency",
  queryMap = fetch.currencyQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.CurrencySummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalCurrency"]}
      hidePresents={hidePresents}
    />
  );
};
