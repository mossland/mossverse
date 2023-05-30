import { GroupCall } from "@social/client";
import { Link } from "@shared/client";
import { fetch } from "@mossland/client";

export default async function Page() {
  const { groupCallInit } = await fetch.social.initGroupCall();
  return (
    <div className="flex">
      <Link href={"/groupCall/new"}>Start</Link>
      <GroupCall.Zone.Card init={groupCallInit} />
    </div>
  );
}
