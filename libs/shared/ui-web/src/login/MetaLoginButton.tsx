// ! This File Needs to be Refactor
import { st } from "@shared/data-access";

type MetaLoginButtonProps = {
  title: string;
  color?: string;
};
export const MetaLoginButton = ({ title }: MetaLoginButtonProps) => {
  return (
    <button
      className={`md:block bg-[#66fef0] md:w-[370px] md:h-[57px] mb-10px md:p-[10px] md:mb-[30px] md:text-[22px] text-[#000] bg-white text-center rounded-[10px] border-[2px] border-solid border-[#000]  w-[260px] h-[50px] p-[7px] mb-[10px] text-[16px] transition-all duration-500 cursor-pointer hover:bg-[#66fef0]/90`}
      onClick={() => st.do.setKeyringModal("addWallet")}
    >
      {title}
    </button>
  );
};
