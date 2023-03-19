import { gql, st, store } from "../../stores";
import { Common, MarketNav, MyTokenButton, MenuBar } from "../";
import { BiChevronRight } from "react-icons/bi";
import { darken } from "polished";
import { Listing } from "@platform/ui-web";

export const MarketHeader = () => {
  const self = st.use.self();

  return (
    <div>
      <div className={`px-[22px] pt-[12px] flex gap-[53px] max-md:gap-[13px]`}>
        <div className="flex-1">
          <Common.MyBalance />
        </div>
        <div className="flex-1">
          {self.id && self.id?.length ? (
            <>
              <Common.MyAddress />
              <MyTokenButton />
            </>
          ) : (
            <div className="mb-[10px]">
              <Common.Connect />
            </div>
          )}
        </div>
      </div>
      <MarketNav />
    </div>
  );
};
