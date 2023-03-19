import { WindowHeader } from "@shared/ui-web";
import React, { ReactNode } from "react";

export type ReactModalType = {
  title: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  onClose: () => void;
  type: "reduce" | "close";
  children: ReactNode;
};

export const ReactModal = ({
  title,
  type = "close",
  onClose,
  height,
  width,
  minWidth,
  minHeight,
  children,
}: ReactModalType) => {
  return (
    <>
      <div className="fixed inset-0 bg-white/10 z-[0.9] backdrop-blur-md" />
      <div
        className={`border-[3px] border-black fixed top-1/2 left-1/2
        ${minWidth ? `min-w-${minWidth}` : ""}
        ${minHeight ? `min-h-${minHeight}` : "min-h-[400px]"}
        ${width ? `w-${width}` : "w-[714px]"}
        ${height ? `h-${height}` : "h-auto"} bg-white rounded-lg overflow-hidden -translate-x-1/2 -translate-y-1/2`}
      >
        <WindowHeader title={title} close={onClose} type={type} />
        {children}
      </div>
    </>
  );
};
