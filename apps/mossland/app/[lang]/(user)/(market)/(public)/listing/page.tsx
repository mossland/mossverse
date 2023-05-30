import { Common, fetch } from "@mossland/client";
import { Listing } from "@platform/client";
import { getAccount } from "@util/client";

export default async function Page({ searchParams }) {
  const account = getAccount();
  const query = { status: "active", type: "", ...(account ? { user: { $ne: account.id } } : {}) };
  const { listingInit } = await fetch.platform.initListing({ query });
  return (
    <div className="h-full">
      {/* <MarketHeader />
      <MenuBar /> */}
      <Listing.Zone.Market className="grid grid-cols-2 gap-4 px-5 mt-5 md:grid-cols-4" init={listingInit} />
      <Common.Modal title="" type="close" storeName="listing">
        <Listing.Zone.MarketViewModal />
      </Common.Modal>
    </div>
  );
}
