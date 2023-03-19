import React, { useEffect } from "react";
import { MarketNav, MyTokensHeader, MarketHeader, Common } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import Router from "next/router";
import { Character } from "@decentverse/ui-web";
import { DataViewModal, LoadItems } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";
import { BiChevronLeft } from "react-icons/bi";

export default function Page() {
  const thingList = st.use.thingList();
  const characterInSubmit = st.use.characterInSubmit();

  useEffect(() => {
    st.do.viewCharacterInSubmit(Router.query.characterId as string);
  }, []);
  return (
    <div className="overflow-hidden">
      <MarketHeader />
      <button className="bg-transparent" onClick={() => Router.back()}>
        <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
      </button>
      {characterInSubmit === "loading" ? (
        <SkeletonList num={6} height={378} className="rounded-xl" />
      ) : (
        <Character.View
          character={characterInSubmit}
          slice={st.slice.characterInSubmit}
          actions={
            <div className="flex px-[150px] pt-5 items-cetner justify-center">
              {characterInSubmit.status === "approved" ? (
                <Common.MintButton
                  onClick={() => {
                    Router.push(`/character/${characterInSubmit.id}/newTrade`);
                  }}
                >
                  판매 준비
                </Common.MintButton>
              ) : characterInSubmit.status === "rejected" ? (
                <Common.MintButton
                  title=""
                  onClick={() => {
                    Router.push(`/character/${characterInSubmit.id}/edit`);
                  }}
                >
                  스킨 수정
                </Common.MintButton>
              ) : (
                <></>
              )}
            </div>
          }
        />
      )}
    </div>
  );
}
