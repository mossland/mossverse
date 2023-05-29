import { Image } from "@shared/client";
import { Utils, getAccount } from "@util/client";
import { fetch, usePage } from "@mossland/client";
import { twMerge } from "tailwind-merge";

interface GeneralProps {
  className?: string;
  stakePool: fetch.StakePool;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const General = ({ className, stakePool }: GeneralProps) => {
  const { l } = usePage();

  return (
    <div className={twMerge("w-full h-auto p-5 text-6xl", ``)}>
      <div className="mb-4 text-4xl text-center">{stakePool.name}</div>
      <div className="w-full h-[90%]">
        <div className="w-full h-full p-5 border border-gray-400 rounded-md md:p-10">
          <div className="flex items-center justify-around w-full mb-4">
            <div>
              <div className="text-base text-gray-600 md:text-3xl">Total Staking Amount</div>
              <div className="flex items-center justify-center gap-2">
                <Image src="/images/mm_coin.png" width={20} height={20} />
                <div className="text-base md:text-3xl">{Utils.numberWithCommas(stakePool.totalValue)}</div>
              </div>
            </div>
            <div>
              <div className="text-base text-gray-600 md:text-3xl">Left Hour</div>
              <div className="flex items-center justify-center text-base md:text-3xl">
                {stakePool.getTotalHour()}&nbsp;hr
              </div>
            </div>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr className="mb-5">
                <th className="text-sm text-left text-gray-600 md:text-xl">Owner</th>
                <th className="text-sm text-gray-600 md:text-xl">Duration</th>
                <th className="text-sm text-gray-600 md:text-xl">Amount</th>
                <th className="text-sm text-gray-600 md:text-xl">Reword %</th>
              </tr>
            </thead>
            <tbody>
              {stakePool.stakings.map((staking, idx) => (
                <tr key={idx}>
                  <td className="block text-sm md:hidden">{Utils.shorten(staking.wallet.address)}</td>
                  <td className="hidden text-xl md:block">{staking.wallet.address}</td>
                  <td className="text-sm text-center md:text-xl">{staking.getDuration()}&nbsp;hr</td>
                  <td className="text-sm text-center md:text-xl">{Utils.numberWithCommas(staking.value)}</td>
                  <td className="text-sm text-center md:text-xl">{staking.getRewardPrecent()}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const MyStaking = ({ className, stakePool }: GeneralProps) => {
  const account = getAccount();
  const myStakings = stakePool.stakings.filter((staking) => staking.user.id === account?.id);
  return (
    <div className={twMerge("w-full h-auto p-5 text-6xl", ``)}>
      <div className="w-full ">
        {myStakings.length ? (
          <table className="w-full table-auto">
            <thead>
              <tr className="mb-5">
                <th className="text-sm text-left text-gray-600 md:text-xl">Month</th>
                <th className="text-sm text-gray-600 md:text-xl">Duration</th>
                <th className="text-sm text-gray-600 md:text-xl">Amount</th>
                <th className="text-sm text-gray-600 md:text-xl">Reword</th>
              </tr>
            </thead>
            <tbody>
              {myStakings.map((staking, idx) => (
                <tr key={idx}>
                  <td className="text-sm md:text-xl">{staking.stakingAt.format("MM-DD-YYYY")}</td>
                  <td className="text-sm text-center md:text-xl">{staking.getDuration()}&nbsp;hr</td>
                  <td className="text-sm text-center md:text-xl">{Utils.numberWithCommas(staking.value)}</td>
                  <td className="text-sm text-center md:text-xl">{staking.getReward()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="items-center justify-center w-full h-full text-center">기록 없음.</div>
        )}
      </div>
    </div>
  );
};
