"use client";
import * as MocWallet from "./_client";
import { AiOutlineWarning } from "react-icons/ai";
import { BiDownArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { DataDashboard, Image } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { SubmitButton } from "../../client";
import { ethers } from "ethers";
import { fetch, st } from "@mossland/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Menu: DataMenuItem = {
  key: "mocWallet",
  label: "MocWallet",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <MocWallet.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "mocWallet",
  queryMap = fetch.mocWalletQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.MocWalletSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalMocWallet"]}
      hidePresents={hidePresents}
    />
  );
};

export const DepositStep1 = () => {
  const router = useRouter();
  return (
    <div className="p-[23px] border-b-[2px] border-black">
      <p className="text-[22px] leading-[1em]">
        No MOC deposit addresses have been applied for before. Please retrieve the deposit address.
      </p>
      <img className="block text-center mx-auto my-[43px]" src="/images/qr_icon.svg" />
      <SubmitButton
        onClick={() => {
          router.replace("/mocWallet?step=1");
        }}
      >
        <BiDownArrowAlt />
        Get Address
      </SubmitButton>
    </div>
  );
};

interface DepositStep2Props {
  //
  self: fetch.User;
}

export const DepositStep2 = ({ self }: DepositStep2Props) => {
  const router = useRouter();
  return (
    <div className="text-center h-screen md:h-auto flex md:block items-center justify-center leading-[1em] px-[23px] py-[44px] md:border-b-[2px] border-black">
      <div>
        <h3 className="text-[26px] font-bold mb-[14px] leading-[1.1em]">
          Send only MOC to this
          <br />
          deposit address.
        </h3>
        <p className="text-[20px] leading-[1.2em]">
          Sending any other asset, will
          <br />
          result permanent loss
        </p>
        <img src="/images/bank.svg" className="block text-center mx-auto my-[25px]" />
        <SubmitButton
          onClick={async () => {
            router.replace("/mocWallet?step=2");
            await st.do.deposit(self.id);
          }}
        >
          I understand
        </SubmitButton>
      </div>
    </div>
  );
};

// interface WithdrawFormProps {}

export const WithdrawForm = () => {
  const self = st.use.self();
  const depositAmount = st.use.depositAmount();
  const depositAddress = st.use.depositAddress();
  const myKeyring = st.use.myKeyring();
  const wallet = st.use.wallet();
  const ownershipMap = st.use.ownershipMap();

  const max = () => {
    if (!self) return 0;
    if (ownershipMap === "loading") return 0;
    const mmoc = fetch.shared.Ownership.getByName([...ownershipMap.values()], "MMOC");
    if (!mmoc) return 0;
    return Math.floor(mmoc.value);
  };
  return (
    <div>
      <p className="text-black font-normal text-[16px] leading-[16px] mb-[6px]">Amount</p>
      <div className="bg-white flex items-center px-[14px] gap-[10px] border-[2px] border-solid border-black rounded-[8px]">
        <input
          className="border-0 py-[8px] flex-grow text-right text-[20px] text-black bg-white outline-none "
          disabled={!wallet}
          min={0}
          max={max()}
          type="number"
          value={depositAmount}
          onBlur={(e) => st.do.setDepositAmount(max() < e.target.valueAsNumber ? max() : e.target.valueAsNumber)}
          onChange={(e) => st.do.setDepositAmount(max() < e.target.valueAsNumber ? max() : e.target.valueAsNumber)}
        />
        <div className="font-bold text-gray-500 text-[20px] leading-[20px]">MMOC</div>
        <button
          id="max-button"
          className="font-bold bg-transparent text-primary text-[20px] leading-[20px]"
          onClick={() => st.do.setDepositAmount(max())}
        >
          MAX
        </button>
      </div>
      <p className="font-normal text-[16px] leading-[16px] text-right mt-[6px] mb-[9px] text-black">
        = {isNaN(depositAmount) ? 0 : depositAmount} MOC
      </p>
      <p className="text-black font-normal text-[16px] leading-[16px] mb-[6px]">Address</p>
      <div className="bg-white flex items-center px-[14px] gap-[10px] border-[2px] border-solid border-black rounded-[8px]">
        <input
          disabled={!myKeyring.wallets.length}
          className="border-0 py-[8px] flex-grow text-right text-[20px] text-black bg-white outline-none "
          value={depositAddress}
          placeholder="0x0000000000000000000000000000000000000000"
          onChange={(e) => st.set({ depositAddress: e.target.value })}
        />
      </div>
    </div>
  );
};

export const Withdraw = () => {
  const self = st.use.self();
  const depositAmount = st.use.depositAmount();
  const depositAddress = st.use.depositAddress();
  const [agreed, setAggreed] = useState<boolean>(false);
  const disabled = !ethers.utils.isAddress(depositAddress) || !depositAmount || !agreed;
  // const receipt = st.use.receipt();
  const onWithdraw = async () => {
    if (!self) return st.do.showMessage({ content: "please login after withdraw.", type: "error" });
    await st.do.withdraw(self.id, depositAddress, depositAmount);
    st.do.showMessage({ content: "withdraw success", type: "success" });
    setAggreed(false);
    st.do.setDepositAddress("");
    st.do.setDepositAmount(0);
    // toast.success(`withdraw suceess!`);
  };
  return (
    <div className="flex-1 justify-center items-center py-[33px] gap-[10px]">
      <div className="flex gap-5 mb-5 font-bold text-red-500">
        <input
          type={"checkbox"}
          className="duration-500 "
          checked={agreed}
          onChange={(e) => setAggreed(e.target.checked)}
        />
        * 환전하고자 하는 금액과 받는 주소를 다시 한 번 확인해주세요!
        <br />
        &nbsp;&nbsp;환전 요청 이후엔 취소할 수 없습니다.
      </div>
      <button
        className="flex w-full bg-gradient-to-l from-primary rounded-[10px] p-[13px] items-center justify-center font-normal text-[22px] leading-[22px] border-[2px] border-solid border-black disabled:from-gray-400 disabled:to-gray-400 disabled:opacity-40 disabled:cursor-auto"
        disabled={disabled}
        onClick={onWithdraw}
      >
        <Image
          width={12}
          height={12}
          className="w-[18px] inline-block mr-[4px] align-baseline"
          src="/images/mm_coin.png"
        />
        MMOC <BiRightArrowAlt className="mx-[3px]" />{" "}
        <Image
          width={12}
          height={12}
          className="w-[18px] inline-block mr-[4px] align-baseline"
          src="/images/m_coin.png"
        />{" "}
        MOC
      </button>
    </div>
  );
};
