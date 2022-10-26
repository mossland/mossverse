import React, { ReactNode } from "react";

type FormItemProps = {
  label: string;
  children: ReactNode;
};

export const FormItem = ({ label, children }: FormItemProps) => {
  return (
    <label className="flex items-baseline mb-2">
      <div className="font-medium w-36">{label}</div>
      {children}
    </label>
  );
};
