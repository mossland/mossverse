import { BackLink, Link } from "@shared/client";
import { BiChevronLeft } from "react-icons/bi";
import { Character } from "@decentverse/client";
import { Common, fetch } from "@mossland/client";

export default async function Page({ params: { characterId } }) {
  const { character, characterView } = await fetch.decentverse.viewCharacter(characterId);
  return (
    <div className="overflow-hidden">
      <BackLink>
        <button className="bg-transparent">
          <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
        </button>
      </BackLink>
      <Common.Modal type="close" storeName="character" title="">
        <Character.Zone.ViewAndEdit />
      </Common.Modal>
      {/* 뷰 틀어질거임. 배치 수정필요 */}
      <div className="flex justify-center w-full px-10 pt-5 items-cetner">
        {character.status === "approved" ? (
          <Link className="w-full px-10" href={`/character/${character.id}/newTrade`}>
            <Common.SubmitButton>판매 준비</Common.SubmitButton>
          </Link>
        ) : character.status === "rejected" ? (
          <Link className="w-full px-10" href={`/character/${character.id}/edit`}>
            <Common.SubmitButton>수정하기</Common.SubmitButton>
          </Link>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
