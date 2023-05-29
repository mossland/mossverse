import { darken } from "polished";
import React, { ReactNode } from "react";

type BadgeProps = {
  color: string;
};

export const Badge = ({ color }: BadgeProps) => {
  return (
    <div
      className="w-[6px] h-[6px] rounded-full inline-block"
      style={{
        backgroundColor: color,
        borderColor: color,
      }}
    ></div>
  );
};

type RibbonProps = {
  text: string;
  color: string;
  children: ReactNode;
};

export const Ribbon = ({ text, color, children }: RibbonProps) => (
  <div className="relative">
    <div
      className="absolute px-2 py-1 text-xs font-bold transform -rotate-45 bg-[#d48806] right-[-0.62em] top-7"
      style={{ backgroundColor: darken(0.1, color) }}
    ></div>
    <div className="relative">{children}</div>
    <div
      className={`absolute top-2 -right-2 px-2 py-1 text-xs font-bold text-white rounded ${color}`}
      style={{ backgroundColor: color }}
    >
      {text}
    </div>
  </div>
);

Badge.Ribbon = Ribbon;
