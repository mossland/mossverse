"use client";
import { BiChevronRight } from "react-icons/bi";
import { st } from "@mossland/client";
import { useRouter, useSearchParams } from "next/navigation";

export const MenuBar = () => {
  const self = st.use.self();
  const router = useRouter();
  const searchParams = useSearchParams();
  const menu = searchParams && (searchParams.get("menu") as "goods" | "nfts");
  const subMenu =
    searchParams &&
    (searchParams.get("subMenu") as
      | "all"
      | "gifticon"
      | "skinp2p"
      | "raffle"
      | "cyberthug"
      | "mossmarket"
      | "p2p"
      | "MyTokens");
  const queryOfListing = st.use.queryOfListing();

  return (
    <div className="p-5 flex justify-between text-black items-center text-[14px] md:text-[20px] font-bold">
      {menu && subMenu && `${menu.toLocaleUpperCase()}/${subMenu.toLocaleUpperCase()}`}
      <div>
        {subMenu === "cyberthug" && (
          <div className="flex items-center ">
            <div className="text-gray-500 text-[14px]">할인 중인 상품만</div>
            <input
              type="checkbox"
              checked={queryOfListing["priceTags.discountPrice"] ? true : false}
              onChange={async (e) => {
                await st.do.setQueryOfListing({
                  ...queryOfListing,
                  "priceTags.discountPrice": e.target.checked ? { $ne: null } : undefined,
                });
              }}
              className="ml-2 accent-gray-500"
            />
          </div>
        )}
        {self.id && subMenu === "skinp2p" && (
          <div className="flex gap-3">
            <button
              className="flex items-center px-2 py-1 text-black border-0 border-transparent rounded-md bg-secondary"
              onClick={() => router.push("/character")}
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
