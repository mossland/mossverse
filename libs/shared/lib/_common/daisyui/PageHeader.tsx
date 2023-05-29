import { AiOutlineLeft } from "react-icons/ai";
import { BackLink } from "@shared/client";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type HeaderProps = {
  title: ReactNode;
  action?: ReactNode;
  isBack?: boolean;
  icon?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export const PageHeader = ({ title, action, isBack, icon, className = "", titleClassName = "" }: HeaderProps) => {
  return (
    <div
      className={twMerge(
        "items-center justify-between mb-4 border-b sm:flex border-gray-400/20 sm:h-[48px]",
        className
      )}
    >
      <div className="flex items-center">
        {isBack && (
          <div className="flex flex-col items-center justify-center border-r w-18 border-gray-400/20 ">
            <BackLink>
              <button className="flex-1 rounded-none btn btn-ghost rounded-tl-2xl ">
                <AiOutlineLeft />
              </button>
            </BackLink>
          </div>
        )}
        <div className={twMerge("px-4 ml-4 text-lg font-bold flex gap-1 items-center", titleClassName)}>
          {icon}
          {title}
        </div>
      </div>
      <div className="flex justify-end gap-2 px-4 py-1">{action}</div>
    </div>
  );
};
