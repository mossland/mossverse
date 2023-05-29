import { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

type SkeletonProps = {
  className?: string;
  active?: boolean;
  style?: CSSProperties;
};

export const Skeleton = ({ className = "", active, style }: SkeletonProps) => {
  const activeClassName = active ? "animate-pulse" : "";
  return (
    <div className={twMerge("w-full", activeClassName, className)} style={style}>
      <div className="flex flex-col justify-start space-y-3">
        <div className="w-2/5 h-4 bg-gray-200 rounded-md "></div>
        <div className="w-full h-4 bg-gray-200 rounded-md "></div>
        <div className="w-full h-4 bg-gray-200 rounded-md "></div>
        <div className="w-3/5 h-4 bg-gray-200 rounded-md "></div>
      </div>
    </div>
  );
};

const SkeletonButton = ({ className = "", active, style }: SkeletonProps) => {
  const activeClassName = active ? "animate-pulse" : "";
  return (
    <div
      className={twMerge("inline-block w-16 h-8 bg-gray-200 rounded-md align-bottom", activeClassName, className)}
      style={style}
    ></div>
  );
};

Skeleton.Button = SkeletonButton;

const SkeletonInput = ({ className = "", active, style }: SkeletonProps) => {
  const activeClassName = active ? "animate-pulse" : "";
  return (
    <div
      className={twMerge("inline-block w-44 h-8 bg-gray-200 rounded-md align-bottom", activeClassName, className)}
      style={style}
    ></div>
  );
};

Skeleton.Input = SkeletonInput;
