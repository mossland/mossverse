import React, { ReactNode } from "react";
import {
  StyledItemContainer,
  StyledItemImage,
  StyledItemInfo,
  StyledItemInfoTitle,
  StyledItemInfoDesc,
  StyledItemInfoPrice,
} from "./styles";

type BaseProps = {
  children: ReactNode;
  className?: string;
};

type ItemContainerProps = BaseProps & {
  onClick: () => void;
  opacity?: number;
};

export const ItemContainer = ({ children, onClick, opacity = 1, className }: ItemContainerProps) => {
  return (
    <StyledItemContainer onClick={onClick} style={{ opacity }} className={className}>
      {children}
    </StyledItemContainer>
  );
};

type ItemImageProps = {
  src: string;
  className?: string;
};

export const ItemImage = ({ src, className }: ItemImageProps) => {
  return (
    <StyledItemImage className="className">
      {src ? <img src={src} /> : <div className="empty-image">no image</div>}
    </StyledItemImage>
  );
};

export const ItemInfo = ({ children, className }: BaseProps) => {
  return <StyledItemInfo className={className}>{children}</StyledItemInfo>;
};

export const ItemInfoTitle = ({ children, className }: BaseProps) => {
  return <StyledItemInfoTitle className={className}>{children}</StyledItemInfoTitle>;
};

export const ItemInfoDesc = ({ children, className }: BaseProps) => {
  return <StyledItemInfoDesc className={className}>{children}</StyledItemInfoDesc>;
};

export const ItemInfoPrice = ({ children }: BaseProps) => {
  return <StyledItemInfoPrice>{children}</StyledItemInfoPrice>;
};
