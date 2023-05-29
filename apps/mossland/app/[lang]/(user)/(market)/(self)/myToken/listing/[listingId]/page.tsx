import { BackLink } from "@shared/client";
import { BiChevronLeft } from "react-icons/bi";
import { Listing } from "@platform/client";
import { fetch } from "@mossland/client";

export default async function Page({ params: { listingId } }) {
  const { listingView } = await fetch.platform.viewListing(listingId);
  return (
    <div className="overflow-hidden">
      <BackLink>
        <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
      </BackLink>
      <Listing.Zone.SelfView view={listingView} />
    </div>
  );
}
