import { st, gql } from "@mossland/frontend/stores";
import { DataEditModal, GqlProvider, LoadItems } from "@shared/ui-web";
import { Map } from "@decentverse/ui-web";
import Router from "next/router";
import { useEffect, useState } from "react";
import { GroupCall } from "@social/ui-web";

export default function Page() {
  useEffect(() => {
    st.do.newGroupCall({ type: "video" });
  }, []);
  return (
    <div className="">
      <div className="flex">
        <DataEditModal
          slice={st.slice.groupCall}
          onCancel={() => Router.back()}
          onSubmit={() => Router.push("/groupCall")}
        >
          <GroupCall.Edit />
        </DataEditModal>
      </div>
    </div>
  );
}
