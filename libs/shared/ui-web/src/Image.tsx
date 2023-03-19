import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface StackImageProps {
  className?: string;
  srcs: (string | null | undefined)[];
  width: number;
}
export const Stack = ({ className, srcs, width }: StackImageProps) => {
  const urls = srcs.filter((src) => !!src);
  if (!urls.length) return <></>;
  return (
    <div className={twMerge(`relative w-[${width}px] h-[${width}px]`, className)}>
      {urls.map((url, idx) => (
        <div key={idx} style={{ position: "absolute" }}>
          <img alt={`${idx}`} src={url as string} width={width} />
        </div>
      ))}
    </div>
  );
};
