import React, { useEffect } from "react";
import { MarketNav, MyTokensHeader, MarketHeader } from "../../components";
import { gql, st, slice } from "../../stores";
import { env } from "../../env/env";
import Router from "next/router";
import { Character } from "@decentverse/ui-web";
import { DataViewModal, LoadItems } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export function CharacterPage() {
  const marketAddr = env.klaytn.marketAddr;
  const self = st.use.self();
  const thingList = st.use.thingList();
  const characterModalInSubmit = st.use.characterModalInSubmit();

  return (
    <div className="overflow-hidden">
      <MarketHeader />
      <div className="p-5">
        <div className="flex justify-between px-3">
          <div className="text-[22px] font-bold text-black">MY SKINS</div>
          <button
            className="flex items-center px-2 py-1 text-black border-0 border-transparent rounded-md bg-color-main "
            onClick={() => Router.push("/character/new")}
          >
            <div className="text-[1px] md:text-[14px]">마켓에 스킨 올리기</div>
            <BiChevronRight className="text-center" />
          </button>
        </div>
        <div className="flex py-5">
          <div className="flex-1 text-black text-[19px] text-center">Image </div>
          <div className="flex-1 text-black text-[19px] text-center">Name </div>
          <div className="flex-1 text-black text-[19px] text-center">Update </div>
          <div className="flex-1 text-black text-[19px] text-center">Status </div>
        </div>
        <hr className="border-[0.5px] border-gray-300" />
        <LoadItems
          className=""
          slice={st.slice.characterInSubmit}
          init={{ query: { creator: self.id, status: { $nin: ["active", "inactive"] } } }}
          loading={<SkeletonList num={6} height={378} className="rounded-xl" />}
          renderItem={(character: gql.decentverse.Character, index) => (
            <Character.Item.ForUser
              idx={index}
              onClick={async () => Router.push(`/character/${character.id}`)}
              slice={st.slice.characterInSubmit}
              character={character}
              key={character.id}
            />
          )}
        />
      </div>
    </div>
  );
}

export default CharacterPage;
