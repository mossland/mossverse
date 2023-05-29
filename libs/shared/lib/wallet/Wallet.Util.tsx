"use client";
import * as Wallet from "./_client";
import { AiOutlineCreditCard } from "react-icons/ai";
import { DataDashboard, fetch } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";

export const Menu: DataMenuItem = {
  key: "wallet",
  label: "Wallet",
  icon: <AiOutlineCreditCard />,
  render: () => <Wallet.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "wallet",
  queryMap = fetch.walletQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.WalletSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalWallet"]}
      hidePresents={hidePresents}
    />
  );
};
