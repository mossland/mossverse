import { BiChevronRight } from "react-icons/bi";
import { Character } from "@decentverse/client";
import { Common, fetch } from "@mossland/client";
import { Link } from "@shared/client";
import { getAccount } from "@util/client";

export default async function Page() {
  const account = getAccount();
  const { characterInit } = await fetch.decentverse.initCharacter({
    query: { creator: account?.id, status: { $nin: ["active", "inactive"] } },
  });
  return (
    <div className="overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between px-3">
          <div className="text-[22px] font-bold text-black">MY SKINS</div>
          <Link
            href={"/character/new"}
            className="flex items-center px-2 py-1 text-black border-0 border-transparent rounded-md bg-primary "
          >
            <div className="text-[1px] md:text-[14px]">마켓에 스킨 올리기</div>
            <BiChevronRight className="text-center" />
          </Link>
        </div>
        <div className="flex py-5">
          <div className="flex-1 text-black text-[19px] text-center">Image </div>
          <div className="flex-1 text-black text-[19px] text-center">Update </div>
          <div className="flex-1 text-black text-[19px] text-center">Status </div>
        </div>
        <hr className="border-[0.5px] border-gray-300" />
        <Character.Zone.ForUser init={characterInit} />
        <Common.Modal title="" type="close" storeName="character">
          <Character.Zone.ViewAndEdit />
        </Common.Modal>
      </div>
    </div>
  );
}
