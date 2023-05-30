import { Trade } from "@platform/client";
import { getAccount } from "@util/client";
import { fetch } from "@mossland/client";

export default async function Page() {
  const account = getAccount();
  const { tradeInit } = await fetch.platform.initTrade({
    query: { policy: { $in: "reversible" }, ...(account ? { user: { $ne: account.id } } : {}) },
  });
  return (
    <div className="h-full ">
      <Trade.Zone.Market className="grid grid-cols-2 gap-4 px-5 mt-5 md:grid-cols-4" init={tradeInit} />
    </div>
  );
}
