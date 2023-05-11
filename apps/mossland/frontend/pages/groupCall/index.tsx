import { st, gql } from "@mossland/frontend/stores";
import { DataEditModal, GqlProvider, LoadItems } from "@shared/ui-web";
import { Map } from "@decentverse/ui-web";
import Router from "next/router";
import { useState } from "react";

export default function Page() {
  return (
    <div className="">
      <div className="flex">
        <button onClick={() => Router.push("/groupCall/new")}>Start</button>
        <LoadItems
          className="gap-1"
          init={{ query: {} }}
          slice={st.slice.groupCall}
          renderItem={(groupCall: gql.social.LightGroupCall) => (
            <button className="bg-red-500" key={groupCall.id} onClick={() => Router.push(`/groupCall/${groupCall.id}`)}>
              {groupCall.roomId}
            </button>
          )}
        />
      </div>
    </div>
  );
}
