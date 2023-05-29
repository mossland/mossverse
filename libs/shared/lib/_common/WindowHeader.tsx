import { BiX } from "react-icons/bi";
import { ReactNode } from "react";
import { ReduceIcon } from "./";
import { twMerge } from "tailwind-merge";

type WindowHeaderProps = {
  title: ReactNode;
  close: () => void;
  type?: "close" | "reduce";
  className?: string;
};

export const WindowHeader = ({ title, close, type = "close", className = "" }: WindowHeaderProps) => {
  return (
    <div
      className={twMerge(
        "bg-white/60 relative border-b-[2px] border-black height-[36px] rounded-t-[6px] overflow-hidden text-center",
        className
      )}
    >
      <h2 className="text-[22px] m-0">{title}</h2>
      <div
        onClick={close}
        className="h-[34px] absolute w-[40px] right-0 top-0 border-l-[2px] border-black cursor-pointer flex items-center justify-center"
      >
        {type === "close" ? <BiX className="text-[32px]" /> : <ReduceIcon />}
      </div>
    </div>
  );
};
