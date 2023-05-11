import { Props } from "@shared/ui-web";

export const ListingHeader = ({ children, className }: Props.BaseProps) => {
  return <div className={` ${className}`}>{children}</div>;
};

const Menu = ({ children, className }: Props.BaseProps) => {
  return <div className={`px-[22px] pt-[12px] flex gap-[53px] max-md:gap-[13px] ${className}`}>{children}</div>;
};
const Item = ({ children, className }: Props.BaseProps) => {
  return <div className={`w-[50%] ${className}`}>{children}</div>;
};

ListingHeader.Menu = Menu;
ListingHeader.Item = Item;
