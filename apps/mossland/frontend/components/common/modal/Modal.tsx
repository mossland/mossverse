import { WindowHeader } from "@shared/ui-web";
import React, { ReactNode } from "react";

export type ModalType = {
  title: string;
  onClose: () => void;
  type: "reduce" | "close";
  children: ReactNode;
};

export const Modal = ({ title, type = "close", onClose, children }: ModalType) => {
  return (
    <>
      <div className="fixed inset-0 bg-white/10 z-[0.9] backdrop-blur-md" />
      <div className="border-[3px] border-black fixed top-1/2 left-1/2 w-[714px] h-[412px] bg-white rounded-lg overflow-hidden -translate-x-1/2 -translate-y-1/2">
        <WindowHeader title={title} close={onClose} type={type} />
        {children}
      </div>
    </>
  );
};
