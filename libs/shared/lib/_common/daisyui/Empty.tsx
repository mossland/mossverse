// "use client";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import React, { ReactNode } from "react";

type EmptyProps = {
  className?: string;
  description?: ReactNode;
  children?: ReactNode;
};

export const Empty = ({ className = "", description, children }: EmptyProps) => {
  // const { l } = usePage();
  return (
    <div className={twMerge("flex flex-col items-center justify-center p-6", className)}>
      <AiOutlineFolderOpen className="w-16 h-16 mb-4 text-gray-400" />
      {/* <p className="text-gray-500">{description || l("shared.noData")}</p> */}
      <p className="text-gray-500">Empty</p>
      {children}
    </div>
  );
};
