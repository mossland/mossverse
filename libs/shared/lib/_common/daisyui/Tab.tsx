"use client";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface TabProps<T extends string | ReactNode> {
  className?: string;
  value: T;
  renderLabel?: (value: T) => React.ReactNode;
  items: T[] | readonly T[];
  onChange: (value: T) => void;
}
export const Tab = <T extends string | ReactNode>({ className, value, renderLabel, items, onChange }: TabProps<T>) => {
  return (
    <div className={twMerge(`tabs`, className)}>
      {items.map((item, idx) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a
          key={idx}
          className={`tab tab-bordered duration-300 ${value === item ? "tab-active" : ""}`}
          onClick={() => onChange(item)}
        >
          {renderLabel?.(item) ?? item}
        </a>
      ))}
    </div>
  );
};
