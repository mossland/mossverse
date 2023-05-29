"use client";
import { BiCheck, BiChevronLeft } from "react-icons/bi";
import { Common, st } from "@mossland/client";
import { Link, usePage } from "@shared/client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }) {
  const { goto, path } = usePage();
  const self = st.use.self();
  const ownershipMap = st.use.ownershipMap();
  const listingMap = st.use.listingMap();
  useEffect(() => {
    st.do.initListing({ query: { ...{ user: self.id } } });
    st.do.initMoney();
    st.do.initOwnership({ query: { user: self.id, status: "active", type: "item" } });
  }, []);
  !self.id && redirect("/listing");
  return (
    <>
      <div className="px-[33px] py-[20px] h-[107] border-b-[2px] border-b-black">
        <div className="flex justify-center">
          <div className="flex items-center w-1/2">
            <Link href="/listing" className=" bg-transparent mt-[6px] mr-[7px]">
              <BiChevronLeft className="text-black text-[18px] md:text-[26px]" />
            </Link>
            <h2 className="text-[18px] text-black md:text-[26px]">MyTokens</h2>
          </div>
          <div className="w-1/2">
            <Common.MyAddress />
          </div>
        </div>
        <div className="flex mt-[10px]">
          <button
            className={`border-[1px] border-solid border-gray flex items-center justify-center mr-[6px] pr-[14px] py-[3px] rounded-[6px] border-gray text-gray font-bold text-[14px] leading-[14px] bg-primary  ${
              path.includes("ownership") ? "border-black text-black" : " opacity-50"
            } `}
            onClick={() => goto("/myToken/ownership")}
          >
            <BiCheck className={`text-[16px]  ${path.includes("ownership") ? "text-black" : "text-transparent"}`} />
            Sellable ({ownershipMap !== "loading" ? ownershipMap.size : 0})
          </button>
          <button
            className={`border-[1px] border-solid border-gray flex items-center justify-center mr-[6px]  pr-[14px] py-[3px] rounded-[6px] border-gray text-gray font-bold text-[14px] leading-[14px bg-secondary ${
              path.includes("listing") ? "border-black text-black" : " opacity-50"
            } `}
            onClick={() => goto("/myToken/listing")}
          >
            <BiCheck className={`text-[16px] ${path.includes("listing") ? "text-black" : "text-transparent"}`} />
            On Sale({listingMap !== "loading" ? listingMap.size : 0})
          </button>
        </div>
      </div>
      {children}
    </>
  );
}
