"use client";
import { Common, MocSurvey, st } from "@mossland/client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Layout({ children }) {
  const self = st.use.self();
  const jwt = useSearchParams()?.get("jwt");

  useEffect(() => {
    st.do.initNetwork({ query: { status: "active" } });
    st.do.initMoney();
  }, []);
  !self.id && jwt && st.do.login({ auth: "user", jwt });

  return (
    <div className="relative flex flex-col w-full h-screen overflow-y-hidden">
      <div className={`px-[22px] py-10 pt-[12px] flex justify-between gap-2`}>
        <div className="w-full">
          <div className="font-bold text-[26px] leading-5 color-black border-0">Proposals</div>
          <MocSurvey.Util.Filter />
        </div>
        <div className="w-full">{self.id && self.id?.length ? <Common.MyAddress /> : <Common.Connect />}</div>
      </div>
      {children}
    </div>
  );
}
