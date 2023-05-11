import { ReactElement, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface RadioProps {
  value: string;
  className?: string;
  children: ReactNode | ReactElement | ReactElement[];
  onChange: (value: string) => void;
}
export const Radio = ({ value, children, className, onChange }: RadioProps) => {
  return (
    <div className={twMerge(`flex items-center gap-2`, className)}>
      {(children as ReactElement[]).map((child, idx) => {
        return (
          <div className="flex items-center justify-center gap-1">
            <input
              type="radio"
              className="radio radio-primary radio-sm "
              checked={value === child.props.value}
              onChange={() => onChange(child.props.value)}
            />
            {child}
          </div>
        );
        // }
      })}
    </div>
  );
};

interface ItemProps {
  value: string;
  children: ReactNode | ReactElement;
  className?: string;
  checked?: boolean;
  onChange?: (value: string) => void;
}

const Item = ({ value, children }: ItemProps) => {
  return <div>{children}</div>;
};
Radio.Item = Item;
