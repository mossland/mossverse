"use client";
import { BiChevronLeft } from "react-icons/bi";
import { Character } from "@decentverse/client";
import { Common, st } from "@mossland/client";
import { DataEditModal, SignWallet } from "@shared/client";
import { env } from "@mossland/env/env";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const self = st.use.self();
  const router = useRouter();
  const characterForm = st.use.characterForm();
  useEffect(() => {
    st.do.newCharacter({ creator: self });
  }, [self]);
  useEffect(() => {
    if (!characterForm.file) return;
    const characterMotion = { row: 0, column: 2, duration: 500 };
    const file = characterForm.file;
    st.do.setCharacterForm({
      ...characterForm,
      tileSize: [Math.floor(file.imageSize[0] / 2), Math.floor(file.imageSize[1] / 4)],
      totalSize: file.imageSize,
      size: [Math.floor(file.imageSize[0] / 6), Math.floor(file.imageSize[1] / 12)],
      right: {
        idle: characterMotion,
        walk: { ...characterMotion, row: characterMotion.row + 1 },
      },
      left: {
        idle: { ...characterMotion, row: characterMotion.row + 2 },
        walk: { ...characterMotion, row: characterMotion.row + 3 },
      },
    });
  }, [characterForm.file]);

  return (
    <div className="overflow-hidden">
      <button className="bg-transparent" onClick={() => router.back()}>
        <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
      </button>
      <DataEditModal
        type="form"
        sliceName="character"
        renderSubmit={(item, opt) => {
          return (
            <SignWallet
              className="w-full px-5"
              walletType="metamask"
              networkType={env.networkType}
              onSigned={async () => {
                await st.do.createCharacter();
                router.push("/character");
              }}
            >
              <Common.SubmitButton className="w-full">제출</Common.SubmitButton>
            </SignWallet>
          );
        }}
        renderCancel={false}
        onSubmit={() => router.push("/character")}
        onCancel={() => router.back()}
      >
        <Character.Edit.ForUser />
      </DataEditModal>
    </div>
  );
}
