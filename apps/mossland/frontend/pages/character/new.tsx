import React, { useEffect } from "react";
import { MarketNav, MyTokensHeader, MarketHeader, Common } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import Router from "next/router";
import { Character } from "@decentverse/ui-web";
import { DataEditModal, DataViewModal, LoadItems } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";
import { BiChevronLeft } from "react-icons/bi";
import { client } from "@shared/util-client";

export default function Page() {
  const self = st.use.self();
  const characterFormInSubmit = st.use.characterFormInSubmit();
  useEffect(() => {
    st.do.newCharacterInSubmit({ creator: self });
  }, []);
  useEffect(() => {
    if (!characterFormInSubmit.file) return;
    const characterMotion = { row: 0, column: 2, duration: 500 };
    const file = characterFormInSubmit.file;
    st.do.setCharacterFormInSubmit({
      ...characterFormInSubmit,
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
    //! 근본적인 해결책 필요 (user가 넣는다던지, addFile할 때 자동으로 기입한다던지)
  }, [characterFormInSubmit.file]);

  return (
    <div className="overflow-hidden">
      <MarketHeader />
      <button className="bg-transparent" onClick={() => Router.back()}>
        <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
      </button>
      <DataEditModal
        type="form"
        slice={st.slice.characterInSubmit}
        // submitStyle={"w-full bg-color-main border-1"}
        // cancelStyle={"w-full bg-red-500"}

        renderSubmit={(item, opt) => {
          return (
            <Common.MintButton
              className="mx-[50px]"
              disabled={opt.disabled}
              onClick={async () => {
                await client.setWallet("metamask");
                await st.do.createCharacterInSubmit();
                Router.push("/character");
              }}
            >
              제출
            </Common.MintButton>
          );
        }}
        renderCancel={false}
        onSubmit={() => Router.push("/character")}
        onCancel={() => Router.back()}
      >
        <Character.Edit.ForUser
          slice={st.slice.characterInSubmit}
          actions={
            <div>
              <div>
                <div className="text-[18px] mb-5">커스텀 제작을 위한 안내</div>
                <ul className="list-decimal">
                  <li>세 종류의 모습이 하나의 파일에 들어있어야 합니다.</li>
                  <li>이미지 사이지는 126*600이고, 확장자는 png입니다.</li>
                  <li>운영팀에서 검수 후 마켓에 리스팅됩니다.</li>
                  <li>부적절하거나 잘못된 포멧의 스킨은 리스팅이 거절 될 수 있습니다.</li>
                </ul>
              </div>
              {/* <Common.MintButton className="mt-[40px]" title="제출" onClick={() => st.do. */}
              {/* <SkinP2p.Action.CharacterReapply slice={st.slice.characterInSubmit} /> */}
            </div>
          }
        />
      </DataEditModal>
    </div>
  );
}
