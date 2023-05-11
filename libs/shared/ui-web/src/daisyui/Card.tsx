import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type CardProps = {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
  cover?: ReactNode;
  title?: ReactNode;
  extra?: ReactNode;
  footer?: ReactNode;
};

export const Card = ({ children, onClick, className = "", hoverable, cover, title, extra, footer }: CardProps) => {
  const hoverableClass = hoverable ? "hover:shadow-xl" : "";
  const onClickClass = onClick ? "cursor-pointer" : "";
  return (
    <div
      className={twMerge(
        "relative duration-300 border shadow-sm border-gray-100 card card-compact",
        hoverableClass,
        onClickClass,
        className
      )}
      onClick={onClick}
    >
      {title && <h2 className="block p-4 text-lg truncate border-b border-gray-100 card-title">{title}</h2>}
      {cover && <figure className="mb-0">{cover}</figure>}
      {extra && <div className="absolute top-0 right-0 p-4">{extra}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};
