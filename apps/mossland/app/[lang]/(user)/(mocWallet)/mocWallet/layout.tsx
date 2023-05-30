"use client";
import { BiRightArrowAlt } from "react-icons/bi";
import { Common, st } from "@mossland/client";
import { Link } from "@shared/client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Layout({ children }) {
  const self = st.use.self();
  const searchParams = useSearchParams();
  useEffect(() => {
    const jwt = searchParams.get("jwt");
    if (!self.id && jwt) st.do.login({ auth: "user", jwt });
  }, []);

  return (
    <div className="h-screen overflow-hidden">
      <div className="px-[22px] py-[12px] ">
        <div className="flex flex-col-reverse md:flex-row gap-0 md:flex  md:gap-[53px]">
          <div className="flex-1 py-[10px] ">
            <h2 className="font-bold text-[26px] leading-[1em] md:block hidden">Exchange</h2>
            <Common.MyBalance />
          </div>
          <div className="flex-1 py-[10px]">{self.id ? <Common.MyAddress /> : <Common.Connect />}</div>
        </div>
        <div className="md:hidden">
          <div className="mt-[10px] mb-[20px] flex justify-between gap-[16px]">
            <Link href="/deposit">
              <button
                disabled={!self.id}
                className="flex items-center justify-center text-[22px] bg-gradient-to-r from-white to-[#f5b5ff] border-[2px] border-solid rounded-[10px] px-[13px] py-[5px] border-black
          disabled:from-[#f5b5ff] disabled:to-[#f5b5ff] disabled:opacity-40 disabled:cursor-default text-black"
              >
                MOC
                <BiRightArrowAlt />
                <img className="w-[22px] h-[22px] mr-2" src="/images/mm_coin.png" />
                MMOC
              </button>
            </Link>

            <Link href="/withdraw">
              <button
                disabled={!self.id}
                className="flex items-center h-[48px] justify-center text-[22px] bg-gradient-to-r from-white to-primary border-[2px] border-solid rounded-[10px] p-[13px] border-black
          text-blackdisabled:from-primary disabled:to-primary disabled:opacity-40 disabled:cursor-default text-black"
                id="mmoc-to-moc-button"
              >
                MMOC
                <BiRightArrowAlt />
                <img className="w-[22px] h-[22px] mr-2" src="/images/m_coin.png" />
                MOC
              </button>
            </Link>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
