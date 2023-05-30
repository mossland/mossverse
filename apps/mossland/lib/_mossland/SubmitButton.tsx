"use client";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type SubmitButtonProps = {
  onClick?: () => void | Promise<void>;
  children: ReactNode;
  title?: string;
  disabled?: boolean;
  className?: string;
};

export const SubmitButton = ({ onClick, children, title, disabled, className }: SubmitButtonProps) => {
  return (
    <button
      className={twMerge(
        "w-full px-[18px]  py-[18px] rounded-[10px] border-[2px] border-solid border-black font-normal text-[18px] leading-[22px] transition duration-500 cursor-pointer bg-primary items-center justify-center flex disabled:bg-gray-300 disabled:opacity-80 disabled:cursor-default",
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
