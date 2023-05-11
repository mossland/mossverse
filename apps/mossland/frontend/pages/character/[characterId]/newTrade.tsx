import React, { useEffect } from "react";
import { MarketNav, MyTokensHeader, MarketHeader, Common } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import { Trade } from "@platform/ui-web";
import Router from "next/router";
import { Character } from "@decentverse/ui-web";
import { DataEditModal, DataViewModal, LoadItems } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";
import { BiChevronLeft } from "react-icons/bi";
import Image from "next/image";
import { Skeleton } from "antd";

export default function Page() {
  const self = st.use.self();
  const characterInSubmit = st.use.characterInSubmit();
  const thingList = st.use.thingList();
  const MMOC = thingList !== "loading" ? (gql.shared.Thing.find(thingList, "MMOC") as gql.shared.Thing) : null;
  const tradeForm = st.use.tradeForm();

  useEffect(() => {
    st.do.viewCharacterInSubmit(Router.query.characterId as string);
  }, []);
  useEffect(() => {
    if (characterInSubmit === "loading") return;
    st.do.newTrade({
      user: self,
      name: characterInSubmit.name,
      outputs: [
        {
          thing: MMOC,
          type: "thing",
          value: 0,
          product: null,
          token: null,
          currency: null,
          wallet: null,
          originalValue: null,
        } as any,
      ],
      inputs: [
        {
          thing: characterInSubmit.thing as gql.shared.Thing,
          type: "thing",
          value: 0,
          product: null,
          token: null,
          currency: null,
          wallet: null,
          originalValue: null,
        } as any,
      ],
      policy: ["reversible"],
    });
  }, [characterInSubmit]);
  return (
    <div className="overflow-hidden">
      <MarketHeader />
      <button className="bg-transparent" onClick={() => Router.back()}>
        <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
      </button>
      <DataEditModal
        type="form"
        renderSubmit={(trade: gql.platform.Trade, options) => {
          return (
            <Common.MintButton
              {...options}
              disabled={!options.disabled && !tradeForm.outputs[0]?.value}
              className="mx-[100px] my-5"
              onClick={async () => {
                await st.do.tradeSkin();
                Router.push(`/character`);
              }}
            >
              판매 시작
            </Common.MintButton>
          );
        }}
        slice={st.slice.trade}
      >
        {characterInSubmit === "loading" ? (
          <Skeleton className="rounded-xl" />
        ) : (
          <>
            <Character.View slice={st.slice.characterInSubmit} character={characterInSubmit} />
            <div className="flex mx-10">
              {/* <div>판매하실 가격을 입력해주세요.</div> */}
              <div className="text-[22px]">
                가격
                <Common.MossInput
                  type="number"
                  value={tradeForm.outputs[0]?.value ?? 0}
                  icon={<Image alt="input" width={20} height={20} src={tradeForm.outputs[0]?.thing?.image.url ?? ""} />}
                  onChange={(e) => {
                    st.do.writeOnTrade("outputs.0.value", Number(e.target.value));
                  }}
                />
              </div>
            </div>
          </>
        )}
      </DataEditModal>
    </div>
  );
}
