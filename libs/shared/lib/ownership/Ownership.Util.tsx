"use client";
import * as Ownership from "./_client";
import { AiOutlineOneToOne } from "react-icons/ai";
import { DataDashboard, InventoryIcon } from "../_common";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { fetch, st } from "@shared/client";

export const Menu: DataMenuItem = {
  key: "ownership",
  label: "Ownership",
  icon: <AiOutlineOneToOne />,
  render: () => <Ownership.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "ownership",
  queryMap,
  hidePresents,
}: ModelDashboardProps<fetch.OwnershipSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={fetch.ownershipQueryMap}
      columns={["totalOwnership"]}
      hidePresents={hidePresents}
    />
  );
};

export const InventoryPreview = () => {
  return (
    <button
      className="bg-white rounded-md px-[11px] py-[12px] cursor-pointer duration-500 mr-3 z-[1] ml-1 border-[3px] border-solid border-black hover:opacity-50 "
      onClick={() => st.do.setOwnershipModal("open")}
    >
      <InventoryIcon />
    </button>
  );
};
