import { BiChevronLeft, BiRightArrowAlt } from "react-icons/bi";
import { Link } from "@shared/client";
import { MocWallet } from "@mossland/client";

export default async function Page() {
  return (
    <div>
      <div className="relative flex items-center justify-center md:h-[44px] md:border-b-[2px] md:border-black">
        <div className="absolute text-black top-[16px] left-[12px] text-[34px] md:hidden">
          <Link href="/mocWallet" passHref>
            <BiChevronLeft />
          </Link>
        </div>
        <div className="my-[20px] flex items-center font-bold text-[26px] leading-[26px] [&_img]:w-[18px] [&_img]:h-[18px] [&_img]:mr-[4px] [&_svg]:mx-[8px] md:text-[22px] md:leading-[44px] md:font-normal">
          <img src="/images/m_coin.png" />
          MOC
          <BiRightArrowAlt />
          <img src="/images/mm_coin.png" />
          MMOC
        </div>
      </div>
      <MocWallet.Zone.Deposit />
    </div>
  );
}
