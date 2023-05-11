import { gql, st, slice } from "../../../stores";
import { FilterCheckBox } from "./";
import Router from "next/router";
import { BiChevronRight } from "react-icons/bi";

export const MenuBar = () => {
  const self = st.use.self();
  const menu = Router.query.menu as "goods" | "nfts";
  const subMenu = Router.query.subMenu as
    | "all"
    | "gifticon"
    | "skinp2p"
    | "raffle"
    | "cyberthug"
    | "mossmarket"
    | "p2p"
    | "MyTokens";
  return (
    <div className="p-5 flex justify-between text-black items-center text-[14px] md:text-[20px] font-bold">
      {menu && subMenu && `${menu.toLocaleUpperCase()}/${subMenu.toLocaleUpperCase()}`}
      <div>
        {subMenu === "cyberthug" && <FilterCheckBox />}
        {self.id && subMenu === "skinp2p" && (
          <div className="flex gap-3">
            <button
              className="flex items-center px-2 py-1 text-black border-0 border-transparent rounded-md bg-color-extra"
              onClick={() => Router.push("/character")}
            >
              <div className="text-[1px] md:text-[14px]">나의 스킨 업로드 현황</div>
              <BiChevronRight className="text-center" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
