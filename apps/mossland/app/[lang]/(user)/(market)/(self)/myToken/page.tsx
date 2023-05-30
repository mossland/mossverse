import { Listing } from "@platform/client";
import { getAccount } from "@util/client";
import { fetch } from "@mossland/client";

export default async function Page() {
  const account = getAccount();
  const { listingInit } = await fetch.platform.initListing({ query: { user: account?.id } });
  return (
    <Listing.Zone.Self
      className="flex flex-wrap overflow-visible items-center px-[10px] py-[5px] md:px-[33px] md:py-[20px] overflow-y-hidden flex-wrapitems-start gap-[10px]"
      init={listingInit}
    />
  );
}
