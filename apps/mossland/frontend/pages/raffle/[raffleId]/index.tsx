import React, { useEffect } from "react";
import { Common, MarketHeader, MenuBar, BackButton } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import { Raffle } from "@platform/ui-web";
import Router from "next/router";
import { DataViewModal, LoadItems } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";

export default function Page() {
  const self = st.use.self();
  const raffle = st.use.raffle();
  useEffect(() => {
    st.do.viewRaffle(Router.query.raffleId as string);
  }, []);

  return (
    <div className="overflow-hidden">
      <MarketHeader />
      <BackButton />
      <div>
        {raffle === "loading" ? (
          <SkeletonList num={6} height={378} className="rounded-xl" />
        ) : (
          <Raffle.View.InSelf
            self={self}
            slice={st.slice.raffle}
            raffle={raffle}
            actions={
              <>
                {raffle.status === "raffling" && (
                  <button
                    className={`w-full mt-[20px] mb-[24px] p-[8px] border-solid border-[2px] text-center text-[22px] rounded-md text-black border-[#000] bg-main-mint "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#ddd] disabled:opacity-50`}
                    onClick={async () => await st.do.requestRaffle()}
                  >
                    참여
                  </button>
                )}
              </>
            }
          />
        )}
      </div>
    </div>
  );
}
