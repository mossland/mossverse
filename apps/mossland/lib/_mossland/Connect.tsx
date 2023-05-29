"use client";
import { LoginButton, LoginSelector, LoginSelectorMobile } from "@shared/client";
import { st } from "@mossland/client";

export const Connect = () => {
  const myKeyring = st.use.myKeyring();
  const networkMap = st.use.networkMap();
  if (networkMap === "loading") return <>loading...</>;
  if (myKeyring.wallets.length)
    return (
      <div className="truncate w-full bg-[#e8e8e8] min-h-[24px] md:min-h-fit py-[3px] md:py-[9px] px-[16px] rounded-[4px] overflow-hidden ">
        <span>Address:</span>
        <br />
        {myKeyring.wallets[0].address}
      </div>
    );
  return (
    <>
      <div className="flex justify-end w-full">
        <LoginButton title={"Login"} />
      </div>
      <div className="only-mobile">
        <LoginSelectorMobile networkList={[...networkMap.values()].sort((a, b) => (a.provider === "klaytn" ? 0 : 1))} />
      </div>
      <div className="only-pc">
        <LoginSelector networkList={[...networkMap.values()].sort((a, b) => (a.provider === "klaytn" ? 0 : 1))} />
      </div>
    </>
  );
};
