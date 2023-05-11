import React, { ReactNode } from "react";
import { BiX } from "react-icons/bi";
import { WindowHeader } from "./";

type ModalContainerProps = {
  showModal: boolean;
  closeShowModal: () => void;
  title: ReactNode;
  children: ReactNode;
  isWide?: boolean;
  opacity?: string;
  headerClassName?: string;
  onOk?: () => void;
};

export const ModalContainer = ({
  showModal,
  closeShowModal,
  title,
  children,
  onOk,
  headerClassName = "",
  opacity = "0.3",
  isWide = false,
}: ModalContainerProps) => {
  if (!showModal) return null;

  return (
    <>
      <div className="fixed w-full h-screen left-0 top-0 bg-black/40 z-[1]" />
      {/* <div isWide={isWide} opacity={opacity} className="modal"> */}
      <div
        className="w-[90%] min-w-auto md:w-fit animate-fadeIn z-[2] fixed text-black left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] backdrop-blur-lg rounded-[10px] border-[3px] border-black"
        style={{
          background: `rgba(255, 255, 255, ${opacity})`,
          width: isWide ? "810px" : "406px",
        }}
      >
        <WindowHeader title={title} close={closeShowModal} className={headerClassName} />
        <div className="overflow-y-hidden rounded-b-[10px] p-2">{children}</div>
      </div>
    </>
  );
};
