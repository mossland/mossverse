import { Props } from "@shared/ui-web";

export const ListingDetail = ({ children, className }: Props.BaseProps) => {
  return <div className={` ${className}`}>{children}</div>;
};

const Body = ({ children, className }: Props.BaseProps) => {
  return (
    <div
      className={`flex flex-row ${className}
  `}
    >
      {children}
    </div>
  );
};
const Image = ({ className, src }: Props.ImageProps) => {
  return (
    <div
      className={` ${className}
  `}
    >
      {src ? (
        <img src={src} className="w-[324px] h-[324px] justify-center m-[10px]" />
      ) : (
        <div className="empty-image">no image</div>
      )}
    </div>
  );
};

ListingDetail.Body = Body;
ListingDetail.Image = Image;
