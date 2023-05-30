"use client";
import { BiChevronLeft } from "react-icons/bi";
import { Character } from "@decentverse/client";
import { Common, st } from "@mossland/client";
import { DataEditModal } from "@shared/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page({ params: { characterId } }) {
  const router = useRouter();
  useEffect(() => {
    st.do.editCharacter(characterId);
  }, []);
  return (
    <div className="overflow-hidden">
      <button className="bg-transparent" onClick={() => router.back()}>
        <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
      </button>
      <DataEditModal
        type="modal"
        sliceName="character"
        renderSubmit={() => (
          <Common.SubmitButton className="mt-[40px]" onClick={() => st.do.reapplyCharacter()}>
            제출
          </Common.SubmitButton>
        )}
      >
        <Character.Edit.ForUser />
      </DataEditModal>
    </div>
  );
}
