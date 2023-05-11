import React, { useEffect } from "react";
import { MarketNav, MyTokensHeader, MarketHeader, Common } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import Router from "next/router";
import { Character } from "@decentverse/ui-web";
import { DataEditModal, DataViewModal, LoadItems } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";
import { BiChevronLeft } from "react-icons/bi";

export default function Page() {
  useEffect(() => {
    st.do.editCharacterInSubmit(Router.query.characterId as string);
  }, []);

  return (
    <div className="overflow-hidden">
      <MarketHeader />
      <button className="bg-transparent" onClick={() => Router.back()}>
        <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
      </button>
      <DataEditModal type="form" slice={st.slice.characterInSubmit}>
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
              <Common.MintButton className="mt-[40px]" onClick={() => st.do.reapplyCharacter()}>
                제출
              </Common.MintButton>
              {/* <SkinP2p.Action.CharacterReapply slice={st.slice.characterInSubmit} /> */}
            </div>
          }
        />
      </DataEditModal>
    </div>
  );
}
