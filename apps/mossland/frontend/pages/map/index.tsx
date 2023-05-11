import { st, gql } from "@mossland/frontend/stores";
import { DataEditModal, GqlProvider, LoadItems } from "@shared/ui-web";
import { Map } from "@decentverse/ui-web";
import Router from "next/router";

export default function Page() {
  return (
    <div className="">
      <div className="flex">
        <LoadItems
          className="flex gap-12 ml-12 mt-12"
          init={{ limit: 0 }}
          slice={st.slice.map}
          renderItem={(map: gql.decentverse.LightMap, idx) => (
            <Map.Item map={map} idx={idx} onClick={() => Router.push(`/map/${map.id}`)} />
          )}
        />
      </div>
    </div>
  );
}
