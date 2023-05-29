import { Image } from "@shared/client";
import { StakePool } from "@mossland/client";

export default async function Page({ params: { stakePoolId } }) {
  return (
    <div className="mb-2 ">
      <StakePool.Edit.Staking />
      <div className="items-center justify-center p-[30px]">
        <ul className="list-disc marker:text-black ">
          <div className="flex text-[18px] gap-3 font-bold text-black">
            <Image width={28} height={16} src="/info.svg" />
            약관 및 유의 사항
          </div>
          <ul className="list-disc ml-[20px] font-normal marker:text-black ">
            <li className="text-black ">예치하기는 사용자에게 금전적 수익을 보장하지 않습니다.</li>
            <li className="text-black "> Reward Ratio는 Staking 금액에 비례한 수익이 아닙니다.</li>
            <li className="text-black "> 예치하기를 통해 Reward를 발생하지 않을 수도 있습니다.</li>
            <li className="text-black ">
              게임 사용자의 수와 기타 상황에 의해 예치하기 기능의 Reawrd편차가 발생할 수 있습니다.
            </li>
            <li className="text-black "> 예치하기 기능을 통해 발생한 손실에 대한 책임은 사용자에게 있습니다.</li>
            <li className="text-black ">
              예치하기 기능을 사용하는 것은 투자의 수단이 아님을 인지하고 이에 동의함을 뜻합니다.
            </li>
          </ul>
        </ul>
      </div>
      <StakePool.Util.AddStake stakePoolId={stakePoolId} />
    </div>
  );
}
