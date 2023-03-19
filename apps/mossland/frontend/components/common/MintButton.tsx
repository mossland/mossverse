import { ReactNode } from "react";
import { BiDownArrowAlt } from "react-icons/bi";
import { twMerge } from "tailwind-merge";

type MintButtonProps = {
  onClick: () => void | Promise<void>;
  children: ReactNode;
  title?: string;
  disabled?: boolean;
  className?: string;
};

export const MintButton = ({ onClick, children, title, disabled, className }: MintButtonProps) => {
  return (
    <button
      className={twMerge(
        "w-full px-[18px] py-[18px] rounded-[10px] border-[2px] border-solid border-black font-normal text-[18px] leading-[22px] transition duration-500 cursor-pointer bg-color-main items-center justify-center flex disabled:bg-gray-300 disabled:opacity-80 disabled:cursor-default",
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {title}
      {children}
    </button>
  );
};
