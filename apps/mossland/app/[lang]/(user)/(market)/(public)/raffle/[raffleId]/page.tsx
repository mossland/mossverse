import { BackLink } from "@shared/client";
import { BiChevronLeft } from "react-icons/bi";
import { Raffle } from "@platform/client";
import { getAccount } from "@util/client";
import { fetch } from "@mossland/client";

export default async function Page({ params: { raffleId } }) {
  const account = getAccount();
  const { raffleView } = await fetch.platform.viewRaffle(raffleId);
  return (
    <div className="overflow-hidden">
      {/* <MarketHeader />
      <BackButton /> */}
      <BackLink>
        <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
      </BackLink>
      <Raffle.Zone.SelfView userId={account?.id} view={raffleView} />
    </div>
  );
}
