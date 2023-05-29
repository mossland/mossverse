import { BackLink, Link, Ownership } from "@shared/client";
import { BiChevronLeft } from "react-icons/bi";
import { Listing } from "@platform/client";
import { fetch } from "@mossland/client";

export default async function Page({ params: { ownershipId } }) {
  const { ownershipView } = await fetch.shared.viewOwnership(ownershipId);

  return (
    <div className="overflow-hidden">
      {/* <MyTokensHeader /> */}
      <BackLink>
        <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
      </BackLink>
      <Ownership.Zone.ViewSelf view={ownershipView} />
      <Link href="/self/listing">
        <Listing.Util.Cancel />
      </Link>
    </div>
  );
}
