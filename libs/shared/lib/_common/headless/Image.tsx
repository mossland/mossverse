import { twMerge } from "tailwind-merge";
import NextImage, { ImageProps } from "next/image";
export default function Image({
  className,
  src,
  file,
  ...props
}: Omit<ImageProps, "alt" | "src"> &
  (
    | {
        src: string;
        file?: undefined;
      }
    | { src?: undefined; file: { url: string; imageSize: [number, number] } | null }
  )) {
  const url = src ?? file?.url ?? "/empty.png";
  const [width, height] = [props.width ?? file?.imageSize[0], props.height ?? file?.imageSize[1]];
  return (
    <NextImage
      src={url}
      fill={props.fill || (!width && !height)}
      width={width}
      height={height}
      className={twMerge("object-cover", className)}
      alt="image"
      {...props}
    />
  );
}
