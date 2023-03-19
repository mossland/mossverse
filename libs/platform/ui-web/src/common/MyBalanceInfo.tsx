import { Utils } from "@shared/util";

type MyBalanceInfoProps = {
  address: string;
  balanceInMOC: number;
  balanceInMMOC: number;
  isHideMoc?: boolean;
  isHideMmoc?: boolean;
};

export const MyBalanceInfo = ({ address, balanceInMOC, balanceInMMOC, isHideMoc, isHideMmoc }: MyBalanceInfoProps) => {
  const itemClassName = "flex justify-between mb-[12px]";
  const itemLabelClassName = "text-[#555] font-bold text-[22px] leading-[22px] flex items-center";
  const labelImageClassName = "w-[16px] h-[16px] mr-[4px]";
  const valueClassName = "font-normal text-[22px] leading-[22px] text-black";
  const unitClassName = "ml-[6px] font-bold";

  return (
    <div className="md:flex md:flex-row-reverse md:gap-[30px]">
      <div className="md:flex-1 bg-[#9a9a9a] text-[#555] font-normal text-[16px] leading-[16px] py-[14px] px-[8px] rounded-[10px] mb-[20px] break-words">
        <div className="mb-[4px]">ADDRESS:</div>
        {address}
      </div>

      <div className="md:flex-1 ">
        {!isHideMmoc && (
          <div className={itemClassName}>
            <div className={itemLabelClassName}>
              <img src="/images/mm_coin.png" className={labelImageClassName} />
              <span>MMOC</span>
            </div>
            <div className={valueClassName}>
              {Utils.numberWithCommas(balanceInMMOC)}
              <span className={unitClassName}>MMOC</span>
            </div>
          </div>
        )}

        {!isHideMoc && (
          <div className={itemClassName}>
            <div className={itemLabelClassName}>
              <img src="/images/m_coin.png" className={labelImageClassName} />
              <span>MOC</span>
            </div>
            <div className={valueClassName}>
              {Utils.numberWithCommas(balanceInMOC)}
              <span className={unitClassName}>MOC</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
