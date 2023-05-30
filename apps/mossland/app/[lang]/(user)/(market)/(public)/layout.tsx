"use client";
import { AiOutlineDown } from "react-icons/ai";
import { BiChevronRight } from "react-icons/bi";
import { Common, st } from "@mossland/client";
import { Dropdown, Link, usePage } from "@shared/client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children, searchParams }) {
  const { goto, path } = usePage();
  const self = st.use.self();
  const marketMenu = st.use.marketMenu();
  const marketSubMenu = st.use.marketSubMenu();
  const queryOfListing = st.use.queryOfListing();
  const jwt = searchParams?.jwt;
  useEffect(() => {
    st.do.initNetwork({ query: { status: "active" } });
    st.do.initMoney();
    st.do.setMarketMenu("nfts");
    st.do.setMarketSubMenu("all");
    if (!path.includes("listing")) redirect("/listing");
  }, []);

  !self.id && jwt && st.do.login({ auth: "user", jwt });
  self.id && st.do.initOwnership({ query: { status: "active", user: self.id } });
  return (
    <div className="relative flex flex-col w-full h-screen">
      <div className={`px-[22px] pt-[12px] flex justify-between gap-2`}>
        <div className="w-full">
          <Common.MyBalance />
        </div>
        <div className="w-full">
          {self.id && self.id?.length ? (
            <>
              <Common.MyAddress />
              <Common.MyTokenButton />
            </>
          ) : (
            <div className="mb-[10px]">
              <Common.Connect />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center border-y-[2px] border-solid border-[#000]">
        <div className="flex w-full ">
          <Dropdown
            buttonClassName="btn-ghost "
            dropdownClassName="w-full "
            className="flex-grow "
            value={
              <div className="flex items-center justify-center ">
                <div className={`mr-2 text-[22px] text-black ${marketMenu === "goods" && "font-bold"}`}>GOODS</div>
                <AiOutlineDown />
              </div>
            }
            content={[
              <Link href={"/listing"} key={0} className="w-full btn btn-ghost btn-sm">
                <button
                  className={`w-full btn btn-ghost btn-sm text-center ${marketSubMenu === "cyberthug" && "font-bold"}`}
                  onClick={() => {
                    !path.includes("listing") && goto("/listing");
                    st.do.setMarketMenu("goods");
                    st.do.setMarketSubMenu("cyberthug");
                  }}
                >
                  CyberTHUG
                </button>
              </Link>,
              <Link href="/listing" key={1} className="w-full btn btn-ghost btn-sm">
                <button
                  className={`w-full btn btn-ghost btn-sm text-center ${marketSubMenu === "gifticon" && "font-bold"}`}
                  onClick={() => {
                    !path.includes("listing") && goto("/listing");
                    st.do.setMarketMenu("goods");
                    st.do.setMarketSubMenu("gifticon");
                  }}
                >
                  Gifticon
                </button>
              </Link>,
              <Link href="/trade" key={2} className="w-full btn btn-ghost btn-sm">
                <button
                  className={`w-full btn btn-ghost btn-sm text-center ${marketSubMenu === "skinp2p" && "font-bold"}`}
                  onClick={() => {
                    !path.includes("trade") && goto("/trade");
                    st.do.setMarketMenu("goods");
                    st.do.setMarketSubMenu("skinp2p");
                  }}
                >
                  Skin P2P
                </button>
              </Link>,
              <Link href="/raffle" key={3}>
                <button
                  className={`w-full btn btn-ghost btn-sm text-center ${marketSubMenu === "raffle" && "font-bold"}`}
                  onClick={() => {
                    !path.includes("raffle") && goto("/raffle");
                    st.do.setMarketMenu("goods");
                    st.do.setMarketSubMenu("raffle");
                  }}
                >
                  Raffle
                </button>
              </Link>,
            ]}
          />
          <Dropdown
            buttonClassName="btn-ghost "
            className="flex-grow"
            dropdownClassName="w-full "
            value={
              <div className="flex items-center justify-center ">
                <div className={`mr-2 text-[22px] text-black ${(!marketMenu || marketMenu === "nfts") && "font-bold"}`}>
                  NFT
                </div>
                <AiOutlineDown />
              </div>
            }
            content={[
              <button
                key={1}
                className={`w-full btn btn-ghost btn-sm text-center ${marketSubMenu === "all" && "font-bold"}`}
                onClick={() => {
                  !path.includes("listing") && goto("/listing");
                  st.do.setMarketMenu("nfts");
                  st.do.setMarketSubMenu("all");
                }}
              >
                All
              </button>,
              <button
                key={2}
                className={`w-full btn btn-ghost btn-sm text-center ${marketSubMenu === "mossmarket" && "font-bold"}`}
                onClick={() => {
                  !path.includes("listing") && goto("/listing");
                  st.do.setMarketMenu("nfts");
                  st.do.setMarketSubMenu("mossmarket");
                }}
              >
                MossMarket
              </button>,
              <button
                key={3}
                className={`w-full btn btn-ghost btn-sm text-center ${marketSubMenu === "p2p" && "font-bold"}`}
                onClick={() => {
                  !path.includes("listing") && goto("/listing");
                  st.do.setMarketMenu("nfts");
                  st.do.setMarketSubMenu("p2p");
                }}
              >
                P2P
              </button>,
            ]}
          />
        </div>
      </div>
      <div className="p-5 flex justify-between text-black items-center text-[14px] md:text-[20px] font-bold">
        {marketMenu && marketSubMenu && `${marketMenu.toLocaleUpperCase()}/${marketSubMenu.toLocaleUpperCase()}`}
        <div>
          {marketSubMenu === "cyberthug" && (
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
          {self.id && marketSubMenu === "skinp2p" && path.includes("trade") && (
            <div className="flex gap-3">
              <Link
                className="flex items-center px-2 py-1 text-black border-0 border-transparent rounded-md bg-secondary"
                href="/character"
              >
                <div className="text-[1px] md:text-[14px]">나의 스킨 업로드 현황</div>
                <BiChevronRight className="text-center" />
              </Link>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
