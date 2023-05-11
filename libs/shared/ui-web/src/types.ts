// interface CustomProps {
//   customStyle?: CSSProp;
// }

interface CustomButtonProps {
  backgroundColor?: string;
}

interface CustomTextInputProps {
  onChangeCallback: (value: string) => void;
}
interface CustomNumberInputProps {
  onChangeCallback: (value: number) => void;
}

export type UiWebButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  CustomButtonProps;

export type UiWebTextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> &
  CustomTextInputProps;

// export type UiWebTextProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> &
//   CustomProps;

// export type UiWebImageProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> &
//   CustomProps;

export type UiWebTextInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  CustomTextInputProps;

export type UiWebNumberInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  CustomNumberInputProps;

// export type UiWebDivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLHeadingElement> &
//   CustomProps;
