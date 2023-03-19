import { st, gql } from "@mossland/frontend/stores";
import { DataEditModal, GqlProvider, LoadItems } from "@shared/ui-web";
import { Map } from "@decentverse/ui-web";
import Router from "next/router";
import { useEffect, useState } from "react";
import { GroupCall } from "@social/ui-web";

export default function Page() {
  const self = st.use.self();
  const groupCallId = Router.query.groupCallId as string;
  const groupCall = st.use.groupCall();
  const groupCallModal = st.use.groupCallModal();
  const mediaStream = st.use.mediaStream();
  const cam = st.use.cam();
  const mic = st.use.mic();
  useEffect(() => {
    if (!groupCallId) return;
    st.do.initMediaStream();
    st.do.viewGroupCall(groupCallId, { modal: "join" });
  }, [groupCallId]);
  return (
    <div className="">
      <div className="flex">
        {!mediaStream ? (
          <div>MediaStream 설정 필요</div>
        ) : groupCall === "loading" || groupCallModal !== "join" ? (
          "loading"
        ) : (
          <GroupCall.View.Connection
            selfId={self.id ?? Math.random().toString()}
            groupCall={groupCall}
            actions={
              <div className="absolute left-1/2 bottom-[5%] w-full z-[3] gap-5 -translate-x-1/2 flex justify-center">
                {cam ? <GroupCall.Action.CamActiveSelf /> : <GroupCall.Action.CamInactiveSelf />}
                {mic > 0 ? <GroupCall.Action.MicActiveSelf /> : <GroupCall.Action.MicInactiveSelf />}
              </div>
            }
          />
        )}
        <GroupCall.Action.OtherCalls />
      </div>
    </div>
  );
}
