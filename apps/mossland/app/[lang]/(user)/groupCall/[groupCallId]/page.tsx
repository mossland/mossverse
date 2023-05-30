import { GroupCall } from "@social/client";
import { getAccount } from "@util/client";
import { fetch } from "@mossland/client";

export default async function Page({ params: { groupCallId } }) {
  const account = getAccount();
  const { groupCallView } = await fetch.social.viewGroupCall(groupCallId);
  return (
    <div className="flex">
      <GroupCall.Zone.Connection selfId={account?.id ?? "anonymous"} view={groupCallView} />
      <GroupCall.Util.OtherCalls />
    </div>
  );
}
