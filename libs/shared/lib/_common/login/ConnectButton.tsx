"use client";
import { darken } from "polished";
import { useState } from "react";

type ConnectButtonProps = {
  title: string;
  fontColor?: string;
  backgroundColor?: string;
  icon?: JSX.Element;
  onClick: () => void | Promise<void>;
};
export const ConnectButton = ({ title, fontColor, backgroundColor, icon, onClick }: ConnectButtonProps) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="w-full p-[10px] text-[22px] text-center text-white rounded-[10px] focus:outline-none border-[2px] border-black flex items-center justify-center"
      onClick={onClick}
      style={{
        backgroundColor: isHover ? darken(0.1, backgroundColor ?? "white") : backgroundColor ?? "white",
      }}
    >
      {icon}
      <div style={{ marginLeft: icon ? 8 : 0, color: fontColor }}>{title}</div>
    </button>
  );
};
