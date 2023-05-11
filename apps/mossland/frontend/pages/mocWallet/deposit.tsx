import { GqlProvider } from "@shared/ui-web";
import { env } from "../../env/env";
import { MocToMmocHeader, ExchangeAddressBar, MocToMmocFooter, MocToMmocStep1, MocToMmocStep2 } from "../../components";
import { gql, st, store } from "../../stores";
import { BiChevronLeft, BiRightArrowAlt } from "react-icons/bi";
import Link from "next/link";

export function MocToMmoc() {
  const self = st.use.self();
  // const wallet = st.use.wallet();
  const me = st.use.me();
  const mocWallet = st.use.mocWallet();
  const understand = st.use.understand();
  // const deposit = st.use.deposit();
  //!need to change
  const onDeposit = async () => {
    if (!self) return;
    await st.do.deposit(self.id);
  };

  return (
    <>
      <div className="block md:hidden">
        <div className="relative flex items-center justify-center md:h-[44px] md:border-b-[2px] md:border-black">
          <div className="absolute text-black top-[16px] left-[12px] text-[34px] md:hidden">
            <Link href="/mocWallet" passHref>
              <BiChevronLeft />
            </Link>
          </div>
          <div className="my-[20px] flex items-center font-bold text-[26px] leading-[26px] [&_img]:w-[18px] [&_img]:h-[18px] [&_img]:mr-[4px] [&_svg]:mx-[8px] md:text-[22px] md:leading-[44px] md:font-normal">
            <>
              <img src="/images/m_coin.png" />
              MOC
            </>
            <BiRightArrowAlt />
            <>
              <img src="/images/mm_coin.png" />
              MMOC
            </>
          </div>
        </div>
      </div>
      {(mocWallet === "loading" || !mocWallet) && <MocToMmocStep2 onClick={onDeposit} />}
      {mocWallet && mocWallet !== "loading" && <ExchangeAddressBar address={mocWallet.address} />}
    </>
  );
}

export default MocToMmoc;
