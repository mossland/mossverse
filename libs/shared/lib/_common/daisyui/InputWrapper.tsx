import React, { ReactNode } from "react";

type InputWrapperProps = {
  label: ReactNode;
  children: ReactNode;
  isHorizontal?: boolean;
  isRequired?: boolean;
};

export const InputWrapper = ({ label, children, isHorizontal, isRequired }: InputWrapperProps) => {
  const className = isHorizontal ? "mb-6 flex gap-2" : "mb-6";
  const labelClassName = isHorizontal ? "w-2/5 text-right text-primary" : "mb-1 text-primary";

  return (
    <div className={className}>
      <div className={labelClassName}>
        {isRequired && <span className="mr-1 text-error">*</span>}
        {label}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
