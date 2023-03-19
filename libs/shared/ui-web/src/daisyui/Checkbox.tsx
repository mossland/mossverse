import React, { ReactNode, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  children?: ReactNode;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
};

export const Checkbox = ({
  children,
  checked,
  onChange,
  className,
  checkboxClassName,
  labelClassName,
  ...rest
}: CheckboxProps) => {
  return (
    <label className={twMerge("inline-block mr-2 cursor-pointer", className)}>
      <div className="flex items-center gap-2">
        <input
          {...rest}
          type="checkbox"
          checked={checked}
          className={twMerge("checkbox", checkboxClassName)}
          onChange={onChange}
        />
        {children && <span className={twMerge("mt-1 label-text", labelClassName)}>{children}</span>}
      </div>
    </label>
  );
};
