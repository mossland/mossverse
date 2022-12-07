import React, { ReactNode } from "react";
import { Text, Title, RangePicker, TextArea, Button, Wrapper, TextInput } from "@shared/ui-web";
import { StyledDetailBody, StyledProductImage } from "./styles";
type BaseProps = {
  children: ReactNode;
  className?: string;
};

export const DetailBody = ({ children, className }: BaseProps) => {
  return <StyledDetailBody className={className}>{children}</StyledDetailBody>;
};

type ProductImageProps = {
  src: string;
  className?: string;
};

export const ProductImage = ({ src, className }: ProductImageProps) => {
  return (
    <StyledProductImage className={className}>
      {src ? <img src={src} className="product-image" /> : <div className="empty-image">no image</div>}
    </StyledProductImage>
  );
};
