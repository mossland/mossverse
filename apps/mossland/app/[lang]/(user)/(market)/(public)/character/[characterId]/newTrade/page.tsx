"use client";
import { BiChevronLeft } from "react-icons/bi";
import { Character } from "@decentverse/client";
import { Common, fetch, st } from "@mossland/client";
import { DataEditModal, Skeleton } from "@shared/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page({ params: { characterId } }) {
  const self = st.use.self();
  const router = useRouter();
  const character = st.use.character();
  const thingMap = st.use.thingMap();
  const MMOC =
    thingMap !== "loading" ? (fetch.shared.Thing.find([...thingMap.values()], "MMOC") as fetch.shared.Thing) : null;
  const tradeForm = st.use.tradeForm();

  useEffect(() => {
    st.do.viewCharacter(characterId);
  }, []);
  useEffect(() => {
    if (character === "loading") return;
    st.do.newTrade({
      user: self,
      name: character.name,
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
          thing: character.thing as fetch.shared.Thing,
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
  }, [character]);
  return (
    <div className="overflow-hidden">
      <button className="bg-transparent" onClick={() => router.back()}>
        <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
      </button>
      <DataEditModal
        type="form"
        renderSubmit={(trade: fetch.platform.Trade, options) => {
          return (
            <Common.SubmitButton
              {...options}
              disabled={!options.disabled && !tradeForm.outputs[0]?.value}
              className="mx-[100px] my-5"
              onClick={async () => {
                await st.do.tradeSkin();
                router.push(`/character`);
              }}
            >
              판매 시작
            </Common.SubmitButton>
          );
        }}
        sliceName="trade"
      >
        {character === "loading" ? (
          <Skeleton className="rounded-xl" />
        ) : (
          <>
            <Character.View.General character={character} />
            <div className="flex mx-10">
              <div className="text-[22px]">
                가격
                {/* <MossInput
                  type="number"
                  value={tradeForm.outputs[0]?.value ?? 0}
                  icon={<Image width={20} height={20} src={tradeForm.outputs[0]?.thing?.image.url ?? ""} />}
                  onChange={(e) => st.do.writeOnTrade("outputs.0.value", Number(e.target.value))}
                /> */}
              </div>
            </div>
          </>
        )}
      </DataEditModal>
    </div>
  );
}
