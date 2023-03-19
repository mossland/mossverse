// ! This File Needs to be Refactor
import { st } from "@shared/data-access";

type LoginButtonProps = {
  title: string;
  color?: string;
};
export const LoginButton = ({ title }: LoginButtonProps) => {
  const openModal = () => st.set({ keyringModal: "addWallet" });
  return (
    <button
      className="h-[24px] md:h-fit mt-[4px] md:mt-0 py-[0px] mb-[10px] md:mb-0 text-[14px] block w-full md:py-[8px] px-[16px] md:text-[20px] text-black bg-[#ffe177] text-center rounded-[6px] border-0 transition duration-500 cursor-pointer hover:bg-[#ffe177]/90"
      onClick={openModal}
    >
      {title}
    </button>
  );
};
