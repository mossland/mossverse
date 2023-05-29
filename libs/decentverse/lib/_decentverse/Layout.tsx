"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { twMerge } from "tailwind-merge";

export const Layout = forwardRef(({ children, className, ...props }: any, ref) => {
  const localRef = useRef();
  useImperativeHandle(ref, () => localRef.current);

  return (
    <div
      {...props}
      ref={localRef}
      className={twMerge("absolute top-0 left-0 z-10 w-screen h-screen overflow-hidden dom", className)}
    >
      {children}
    </div>
  );
});
Layout.displayName = "Layout";
