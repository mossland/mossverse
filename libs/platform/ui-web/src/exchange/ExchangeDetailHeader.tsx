import React, { ReactNode, useEffect } from "react";
import { BiRightArrowAlt, BiChevronLeft } from "react-icons/bi";
import Link from "next/link";

type ExchangeDetailHeaderProps = {
  from: ReactNode;
  to: ReactNode;
};

export const ExchangeDetailHeader = ({ from, to }: ExchangeDetailHeaderProps) => {
  return (
    <div className="relative flex items-center justify-center md:h-[44px] md:border-b-[2px] md:border-black">
      <div className="absolute text-black top-[16px] left-[12px] text-[34px] md:hidden">
        <Link href="/exchange" passHref>
          <BiChevronLeft />
        </Link>
      </div>
      <div className="my-[20px] flex items-center font-bold text-[26px] leading-[26px] [&_img]:w-[18px] [&_img]:h-[18px] [&_img]:mr-[4px] [&_svg]:mx-[8px] md:text-[22px] md:leading-[44px] md:font-normal">
        {from}
        <BiRightArrowAlt />
        {to}
      </div>
    </div>
  );
};
