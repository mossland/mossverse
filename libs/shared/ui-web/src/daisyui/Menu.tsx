import React, { ReactElement, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface SelectMenuProps {
  value: string;
  children: ReactElement | ReactElement[];
  className?: string;
  selectedClassName?: string;
  checked?: boolean;
  onChange?: (value: string) => void;
}

export const SelectMenu = ({ className, selectedClassName, children, value }: SelectMenuProps) => {
  return (
    <div className={`flex items-center`}>
      {(children as ReactElement[]).map((child, idx) => {
        return (
          <div
            className={twMerge(
              `border border-green-400 p-2 ${
                idx === 0
                  ? "rounded-tl-md rounded-bl-md border border-r-0"
                  : idx + 1 === (children as ReactElement[]).length
                  ? "rounded-tr-md rounded-br-md border-l-0"
                  : "border-l-0 border-r-0"
              } ${value === child.props.value ? twMerge("bg-green-400", selectedClassName) : ""}

            `,
              className
            )}
          >
            {child}
          </div>
        );
        // }
      })}
    </div>
  );
};
interface ItemProps {
  value: any;
  children?: ReactNode | ReactElement;
  onClick?: (value) => void;
}

export const Item = ({ value, children, onClick }: ItemProps) => {
  return <button onClick={() => onClick && onClick(value)}>{children}</button>;
};

SelectMenu.Item = Item;
