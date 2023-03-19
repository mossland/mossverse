import { ReactNode } from "react";
import { Input } from "./daisyui";

// ! 아직 미사용중인 파일.
interface TextProps {
  className?: string;
  icon?: ReactNode;
  value: string | null;
  placeholder?: string;
  onChange?: (value: string) => void;
  onPressEnter?: () => void;
}
export const Text = ({ className, icon, value, placeholder, onChange, onPressEnter }: TextProps) => {
  return (
    <div className="relative w-full">
      <Input
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        onPressEnter={() => onPressEnter?.()}
        className="input rounded-full pl-12 label border-color-main w-full text-color-main placeholder-color-main-200"
        placeholder={placeholder}
      />
      {icon && <div className="absolute top-0 bottom-0 left-4 text-2xl text-color-main">{icon}</div>}
    </div>
  );
};
