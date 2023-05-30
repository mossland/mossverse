import { Common, fetch } from "@mossland/client";
import { Raffle } from "@platform/client";
import { getAccount } from "@util/client";

export default async function Page() {
  const account = getAccount();
  const { raffleInit } = await fetch.platform.initRaffle({
    query: { status: { $ne: "inactive" }, ...(account ? { user: { $ne: account.id } } : {}) },
  });
  return (
    <div className="overflow-hidden">
      <Raffle.Zone.Self
        className="grid grid-cols-1 md:grid-cols-2  px-[10px] py-[5px] md:px-[33px]  overflow-y-hidden flex-wrap  items-start gap-[10px]"
        init={raffleInit}
      />
      <Common.Modal title="" type="close" storeName="raffle">
        <Raffle.Zone.ViewModal userId={account?.id} />
      </Common.Modal>
    </div>
  );
}
