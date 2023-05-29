import { Image } from "../headless";
import { ReactNode } from "react";

type AvatarProps = {
  className?: string;
  icon?: ReactNode;
  src?: string;
};

export const Avatar = ({ className = "", icon, src = "" }: AvatarProps) => {
  return (
    <div className="relative avatar">
      <div className="w-8 h-8 overflow-hidden rounded-full bg-black/20">
        {src ? (
          <Image src={src} className="object-cover filter " style={{ borderRadius: "50%" }} />
        ) : icon ? (
          <div className="absolute text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
            <div className="">{icon}</div>
            {/* <div className="absolute text-white top-1/2 left-1/2 bg-black/20">{icon}</div> */}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
