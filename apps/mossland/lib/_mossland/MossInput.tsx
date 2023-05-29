"use client";
import { ChangeEvent, ReactNode } from "react";

interface MossInputProps {
  type:
    | "text"
    | "number"
    | "date"
    | "password"
    | "email"
    | "tel"
    | "url"
    | "search"
    | "color"
    | "range"
    | "file"
    | "checkbox"
    | "radio"
    | "submit"
    | "image"
    | "reset"
    | "button"
    | undefined;
  value: number | string;
  icon?: ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const MossInput = ({ value, icon, type, onChange }: MossInputProps) => {
  return (
    <div className="flex  w-full py-1 items-center justify-center px-2 rounded-md border-[1px] duration-300 text-[18px] border-black focus:border-blue-400 hover:border-blue-400">
      {/* <Image width={20} height={20} src={listingForm.priceTags[0].thing?.image.url} /> */}
      {icon && <div className="mr-2">{icon}</div>}
      <input
        type={type}
        className="w-full px-1 py-0 border-0"
        maxLength={20}
        value={String(value) ?? ""}
        onChange={onChange}
      />
    </div>
  );
};
