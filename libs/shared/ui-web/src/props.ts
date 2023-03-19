export type BaseProps = {
  children?: React.ReactNode;
  className?: string;
};

export type ImageProps = BaseProps & {
  src?: string;
};

export type ButtonProps = BaseProps & {
  onClick?: () => void;
  disabled?: boolean;
};

export type InputProps = BaseProps & {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};
