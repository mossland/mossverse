import { ExchangeButtons } from "./";
import { gql, st, store } from "../../stores";
// import { Connect, MyAddress } from "../";
import { Common } from "@mossland/frontend/components";

export const ExchangeHeader = () => {
  const self = st.use.self();
  // if (me === "loading") return null;
  return (
    <div className="px-[22px] py-[12px] ">
      <div className="flex flex-col-reverse md:flex-row gap-0 md:flex  md:gap-[53px]">
        <div className="flex-1 py-[10px] ">
          <h2 className="font-bold text-[26px] leading-[1em] md:block hidden">Exchange</h2>
          <Common.MyBalance />
        </div>
        <div className="flex-1 py-[10px]">{self.id ? <Common.MyAddress /> : <Common.Connect />}</div>
      </div>
      <div className="md:hidden">
        <ExchangeButtons />
      </div>
    </div>
  );
};
