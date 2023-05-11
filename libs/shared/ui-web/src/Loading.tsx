import { Skeleton } from "antd";
import { twMerge } from "tailwind-merge";

interface SkeletonListProps {
  num: number;
  width?: number;
  height: number;
  className?: string;
}
export const SkeletonList = ({ num, width, height, className }: SkeletonListProps) => {
  const widthClass = width ? `w-[${width}px]` : "w-full";
  return (
    <div className="gap-5 flex flex-wrap">
      {new Array(num).fill(0).map((_, index) => (
        <div key={index} className={twMerge("block w-full overflow-hidden rounded relative", widthClass, className)}>
          <Skeleton.Button active block={!width} style={{ height: height, width: width || "100%" }} />
        </div>
      ))}
    </div>
  );
};
