import React, { ReactNode } from "react";
import Link from "next/link";
import { Props } from "@shared/ui-web";

export const ListingItem = ({ children, disabled, onClick, className }: Props.ButtonProps) => {
  return (
    <button
      className={`rounded-md shadow-[0px_0px_8px_0px_#00000033] mt-[5px] ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Wrapper = ({ children, className }: Props.BaseProps) => {
  return <div className={` ${className}`}>{children}</div>;
};

const Image = ({ children, src, className }: Props.ImageProps) => {
  return (
    <>
      {src ? (
        <img className={`w-full h-full rounded-t-[5px] ${className}`} src={src}>
          {children}
        </img>
      ) : (
        <div>no image</div>
      )}
    </>
  );
};

const Info = ({ children, className }: Props.BaseProps) => {
  return <div className={`relative p-[5px] text-[#282828] rounded-b-[6px] ${className}`}>{children}</div>;
};

const Title = ({ children, className }: Props.BaseProps) => {
  return <div className={`text-[12px] ml-[10px] font-bold mb-[4px] text-start ${className}`}>{children}</div>;
};

const Desc = ({ children, className }: Props.BaseProps) => {
  return <div className={`flex ml-[10px] justify-between items-center ${className}`}>{children}</div>;
};

const Price = ({ children, className }: Props.BaseProps) => {
  return <div className={`text-[14px] flex font-bold ${className}`}>{children}</div>;
};

ListingItem.Wrapper = Wrapper;
ListingItem.Image = Image;
ListingItem.Info = Info;
ListingItem.Title = Title;
ListingItem.Desc = Desc;
ListingItem.Price = Price;
