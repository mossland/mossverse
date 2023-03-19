import { constants } from "buffer";
import { ReactNode, useEffect, useState } from "react";

type DropdownProps = {
  value: ReactNode;
  content: ReactNode;
};

export const Dropdown = ({ value, content }: DropdownProps) => {
  useEffect(() => {
    const dropdownContent = document.querySelectorAll(".dropdown-content");
    dropdownContent.forEach((element) => {
      element.addEventListener("click", () => {
        if (!document || !document.activeElement) return;
        (document.activeElement as HTMLElement).blur();
      });
    });
  }, []);

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="flex w-full px-16 text-white rounded-full btn bg-gradient-to-r from-color-gradient-from to-color-gradient-to"
      >
        {value}
      </label>
      <ul
        tabIndex={0}
        className={`grid w-full gap-2 p-2 px-3 my-5 overflow-auto rounded-md shadow md:scrollbar-thin md:scrollbar-thumb-rounded-md md:scrollbar-thumb-gray-300 md:scrollbar-track-transparent max-h-52 dropdown-content bg-base-100 
        `}
      >
        {content}
      </ul>
    </div>
  );
};
