"use client";
import { a, config, useSpring } from "@react-spring/web";
import { twMerge } from "tailwind-merge";
import { useDrag } from "@use-gesture/react";
import React, { useEffect } from "react";

export interface SpringModalProps {
  children: React.ReactNode;
  open?: boolean;
  mode?: "horizontal" | "vertical";
  bgClassName?: string;
  className?: string;
  onCancel?: () => void;
}
export const SpringModal = ({ className, children, open, onCancel }: SpringModalProps) => {
  const right = window.screen.width / 2;
  const [{ x }, api] = useSpring(() => ({ x: right }));
  useEffect(() => {
    open ? openModal({ canceled: !open }) : closeModal(1);
  }, [open]);
  const openModal = ({ canceled }) =>
    api.start({
      x: 0,
      immediate: false,
      config: canceled ? config.wobbly : config.stiff,
    });
  const closeModal = (velocity = 0) =>
    api.start({
      x: right,
      immediate: false,
      config: { ...config.stiff, velocity },
    });

  const bind = useDrag(
    ({ last, velocity: [vx, vy], direction: [dx, dy], movement: [mx, my], cancel, canceled }) => {
      if (mx < -100) cancel();
      if (last) mx > right * 0.5 || (vx > 0.5 && dx > 0) ? closeModal(vx) : openModal({ canceled });
      else api.start({ x: mx, immediate: true });
    },
    {
      from: () => [0, x.get()],
      filterTaps: true,
      bounds: { right: 0 },
      rubberband: true,
    }
  );

  const display = x.to((px) => (px < right ? "block" : "block"));

  return (
    <div>
      <div
        className={`fixed left-0 right-0 top-0 bottom-0 bg-black/20 z-50 ${
          open ? "block" : "hidden"
        } animate-fadeIn duration-300`}
        onClick={() => {
          console.log("click");
          onCancel && onCancel();
        }}
      />
      <a.div className={`fixed z-50 w-1/2 right-0 top-0 bottom-0`} {...bind()} style={{ display, x }}>
        <div className="grid w-full h-full place-items-center">
          <div className={twMerge("w-5/6 h-3/4 bg-white/50 rounded-3xl backdrop-blur-lg p-4", className)}>
            {children}
          </div>
        </div>
      </a.div>
    </div>
  );
};
