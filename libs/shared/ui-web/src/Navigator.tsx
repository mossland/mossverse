import { Props } from "@shared/ui-web";
import { twMerge } from "tailwind-merge";

export const Navigator = ({ children, className }: Props.BaseProps) => {
  return (
    <div
      className={`flex items-center justify-center border-t-[1px] border-b-[1px] border-solid border-[#000] ${className}`}
    >
      {children}
    </div>
  );
};

const Item = ({ children, className, onClick }: Props.ButtonProps) => {
  const twClass = twMerge(
    `text-bold text-[20px] text-[#777] w-[33%] text-center leading-10 cursor-pointer h-[40px] ${className}`
  );
  return (
    <div className={twClass} onClick={onClick}>
      {children}
    </div>
  );
};

Navigator.Item = Item;
