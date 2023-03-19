import React, { useEffect } from "react";
import { MarketHeader, MenuBar } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import { env } from "../../env/env";
import { Raffle } from "@platform/ui-web";
import Router from "next/router";
import { LoadItems } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";

export default function Page() {
  const self = st.use.self();

  useEffect(() => {
    st.do.initRaffle({
      query: { status: { $ne: "inactive" }, ...(self.id?.length ? { user: { $ne: self.id } } : {}) },
    });
  }, []);
  useEffect(() => {
    st.do.initRaffle({
      query: { status: { $ne: "inactive" }, ...(self.id?.length ? { user: { $ne: self.id } } : {}) },
    });
  }, [self, Router.pathname]);

  return (
    <div className="overflow-hidden">
      <MarketHeader />
      <MenuBar />
      <LoadItems
        className="grid grid-cols-1 md:grid-cols-2  px-[10px] py-[5px] md:px-[33px]  overflow-y-hidden flex-wrap  items-start gap-[10px]"
        slice={st.slice.raffle}
        init={{
          query: { status: { $ne: "inactive" }, ...(self.id?.length ? { user: { $ne: self.id } } : {}) },
        }}
        loading={<SkeletonList num={6} height={378} className="rounded-xl" />}
        renderItem={(raffle: gql.platform.Raffle) => (
          <Raffle.Item.InSelf
            onClick={async () => Router.push(`/raffle/${raffle.id}`)}
            self={self}
            raffle={raffle}
            slice={st.slice.raffle}
            key={raffle.id}
            actions={
              <>
                {raffle.status === "raffling" && (
                  <button
                    className={`w-full mt-[20px] mb-[24px] p-[8px] border-solid border-[2px] text-center text-[22px] rounded-md text-black border-[#000] bg-main-mint "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#ddd] disabled:opacity-50`}
                    onClick={async () => Router.push(`/raffle/${raffle.id}`)}
                  >
                    참여
                  </button>
                )}
              </>
            }
          />
        )}
      />
    </div>
  );
}
