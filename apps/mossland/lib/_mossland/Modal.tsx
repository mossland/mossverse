"use client";
import { BiChevronLeft, BiX } from "react-icons/bi";
import { Utils } from "@util/client";
import { st } from "../store";
import React, { ReactNode } from "react";

export type ModalType = {
  title: string;
  storeName: string;
  type: "reduce" | "close";
  children: ReactNode;
};

export const Modal = ({ title, storeName, type = "close", children }: ModalType) => {
  const viewModal = st.use[`${storeName}Modal`]();
  const model = st.use[`${storeName}`]();
  return (
    <>
      {viewModal?.includes(`view`) || viewModal?.includes(`edit`) ? (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black/30 bg-opacity-30"
          onClick={() => st.do[`reset${Utils.capitalize(storeName)}`]}
        >
          <div className="hidden md:block">
            <div className="absolute border-2 w-[90%] backdrop-blur-md rounded-md border-black  top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white z-[1]">
              <div className="bg-white/60 relative border-b-[2px] border-black height-[36px] rounded-t-[6px] overflow-hidden text-center">
                <h2 className="text-[22px] h-[34px] m-0">{title ?? " "}</h2>
                <div
                  onClick={() => st.do[`reset${Utils.capitalize(storeName)}`]()}
                  className="h-[34px] absolute w-[40px] right-0 top-0 border-l-[2px] border-black cursor-pointer flex items-center justify-center"
                >
                  <BiX className="text-[32px]" />
                </div>
              </div>
              {children}
            </div>
          </div>
          <div className="block md:hidden">
            <div className="absolute  overflow-y-scroll w-full h-screen  top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white z-[1]">
              <div className="flex items-center justify-center w-full p-5">
                <button
                  onClick={() => st.do[`reset${Utils.capitalize(storeName)}`]()}
                  className=" absolute top-0 p-5 left-0 text-[32px]"
                >
                  <BiChevronLeft />
                </button>
                <h2 className="w-full text-center text-[22px]">{title}</h2>
              </div>
              {children}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
