"use client";
import * as Product from "./_client";
import { AiOutlineWarning } from "react-icons/ai";
import { DataDashboard, fetch } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";

export const Menu: DataMenuItem = {
  key: "product",
  label: "Product",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <Product.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "product",
  queryMap = fetch.productQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.ProductSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalProduct"]}
      hidePresents={hidePresents}
    />
  );
};
