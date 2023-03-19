import { MmocToMocForm, MmocToMocHeader, WithdrawButton } from "../../components";
import { MyBalance } from "@mossland/frontend/components/common";
import { GqlProvider } from "@shared/ui-web";
import { env } from "../../env/env";
import Link from "next/link";
import { BiChevronLeft, BiRightArrowAlt } from "react-icons/bi";

export function Page() {
  //!need to change
  return (
    <div>
      <div className="relative flex items-center justify-center md:h-[44px] md:border-b-[2px] md:border-black">
        <div className="absolute text-black top-[16px] left-[12px] text-[34px] md:hidden">
          <Link href="/mocWallet" passHref>
            <BiChevronLeft />
          </Link>
        </div>
        <div className="my-[20px] flex items-center font-bold text-[26px] leading-[26px] [&_img]:w-[18px] [&_img]:h-[18px] [&_img]:mr-[4px] [&_svg]:mx-[8px] md:text-[22px] md:leading-[44px] md:font-normal">
          <>
            <img src="/images/mm_coin.png" />
            MMOC
          </>
          <BiRightArrowAlt />
          <>
            <img src="/images/m_coin.png" />
            MOC
          </>
        </div>
      </div>
      <div className="px-[22px]">
        <MyBalance isHideMoc />
        <MmocToMocForm />
        <WithdrawButton />
      </div>
    </div>
  );
}

export default Page;
