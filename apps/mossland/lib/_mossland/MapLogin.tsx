"use client";
import { LoginSelector, LoginSelectorMobile, MetaLoginButton } from "@shared/client";
import { st } from "@mossland/client";
import { useEffect } from "react";

export const MapLogin = () => {
  const self = st.use.self();
  const networkMap = st.use.networkMap();
  useEffect(() => {
    st.do.initNetwork({ query: { status: "active" } });
    if (self.id) st.set({ playerType: "user", playerNickname: self.nickname ?? "unknown" });
  }, [self]);
  return (
    <div className="z-[2]">
      <div className="mt-[50px] min-h-[200px] z-50 ">
        <MetaLoginButton title={"Connect"} />
        <button
          className="md:block md:w-[370px] md:h-[57px] mb-10px md:p-[10px] md:mb-[30px] md:text-[22px] text-[#000] bg-white text-center rounded-[10px] border-[2px] border-solid border-[#000]  w-[260px] h-[50px] p-[7px] mb-[10px] text-[16px] transition-all duration-500 cursor-pointer hover:bg-[#ddd]"
          onClick={() => st.do.setPlayerType("guest")}
        >
          Start as a Guest
        </button>
      </div>
      <div className="only-mobile">
        {networkMap !== "loading" && <LoginSelectorMobile networkList={[...networkMap.values()]} />}
      </div>
      <div className="only-pc">
        {networkMap !== "loading" && <LoginSelector networkList={[...networkMap.values()]} />}
      </div>
    </div>
  );
};
