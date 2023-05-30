"use client";
import { ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";

type DropdownProps = {
  autoBlur?: boolean;
  value: ReactNode;
  content: ReactNode;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
};

export const Dropdown = ({
  autoBlur = true,
  value,
  content,
  className,
  buttonClassName,
  dropdownClassName,
}: DropdownProps) => {
  const [opened, setOpened] = useState(false);
  return (
    <div className={twMerge("dropdown dropdown-end", className)}>
      <label tabIndex={0} className={twMerge("flex btn", buttonClassName)} onClick={() => setOpened(true)}>
        {value}
      </label>
      <ul
        tabIndex={0}
        onClick={() => opened && setOpened(false)}
        className={twMerge(
          "whitespace-nowrap z-40 grid gap-2 my-2 overflow-auto rounded-md shadow md:scrollbar-thin md:scrollbar-thumb-rounded-md md:scrollbar-thumb-gray-300 md:scrollbar-track-transparent pr-3 max-h-52 bg-base-100",
          opened ? "dropdown-content p-1 w-fit h-fit" : "h-[0px] w-[0px] overflow-hidden",
          dropdownClassName
        )}
      >
        {content}
      </ul>
    </div>
  );
};
