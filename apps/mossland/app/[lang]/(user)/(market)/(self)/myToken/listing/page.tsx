import { Listing } from "@platform/client";
import { getAccount } from "@util/client";
import { fetch } from "@mossland/client";
import { notFound } from "next/navigation";

export default async function Page() {
  const account = getAccount();
  if (!account) notFound();
  const { listingInit } = await fetch.platform.initListing({ query: { user: account.id } });
  return (
    <div className="overflow-hidden">
      <Listing.Zone.Self
        className="flex flex-wrap overflow-visible items-center px-[10px] py-[5px] md:px-[33px] md:py-[20px] overflow-y-hidden flex-wrapitems-start gap-[10px]"
        init={listingInit}
      />
    </div>
  );
}
