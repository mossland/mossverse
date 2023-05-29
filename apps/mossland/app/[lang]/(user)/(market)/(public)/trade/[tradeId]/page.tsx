import { BackLink, Link } from "@shared/client";
import { BiChevronLeft } from "react-icons/bi";
import { Trade } from "@platform/client";
import { fetch } from "@mossland/client";

export default async function Page({ params: { tradeId } }) {
  const { tradeView } = await fetch.platform.viewTrade(tradeId);
  return (
    <div className="overflow-hidden">
      {/* <BackButton /> */}
      <BackLink>
        <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
      </BackLink>
      <Trade.Zone.ViewMarket view={tradeView} />
      <Link href="/trade">
        <button className="w-full px-[18px] py-[18px] rounded-[10px] border-[2px] border-solid border-black font-normal text-[18px] leading-[22px] transition duration-500 cursor-pointer bg-primary items-center justify-center flex disabled:bg-gray-300 disabled:opacity-80 disabled:cursor-default mx-[50px]">
          구메
        </button>
        {/* <SubmitButton
          className="mx-[100px]"
          //  onClick={async () => await st.do.buySkin()} //!이거 use client로 옮겨야함.
        >
          구매하기
        </SubmitButton> */}
      </Link>
    </div>
  );
}
