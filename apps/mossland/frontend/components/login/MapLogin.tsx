import { st, gql } from "@mossland/frontend/stores";
import { MetaLoginButton, LoginSelector, LoginSelectorMobile } from "@shared/ui-web";
import { useEffect, useState } from "react";
import { cnst, Utils } from "@shared/util";
import Image from "next/image";
// import { MediaSettingModal } from "@decentverse/ui-web";
interface MapLoginProps {
  map: gql.decentverse.Map;
}
export const MapLogin = ({ map }: MapLoginProps) => {
  const self = st.use.self();
  const networkList = st.use.networkList();
  useEffect(() => {
    if (self.id) st.set({ playerType: "user", playerNickname: self.nickname });
  }, [self]);
  return (
    <div>
      <div className="mt-[50px] min-h-[200px] opacity-0 animate-mainButtons">
        <MetaLoginButton title={"Connect"} />
        <button
          className="md:block md:w-[370px] md:h-[57px] mb-10px md:p-[10px] md:mb-[30px] md:text-[22px] text-[#000] bg-white text-center rounded-[10px] border-[2px] border-solid border-[#000]  w-[260px] h-[50px] p-[7px] mb-[10px] text-[16px] transition-all duration-500 cursor-pointer hover:bg-[#ddd]"
          onClick={() => st.do.setPlayerType("guest")}
        >
          Start as a Guest
        </button>
      </div>
      <div className="only-mobile">
        {networkList !== "loading" && <LoginSelectorMobile networkList={networkList} />}
      </div>
      <div className="only-pc">{networkList !== "loading" && <LoginSelector networkList={networkList} />}</div>
    </div>
  );
};
