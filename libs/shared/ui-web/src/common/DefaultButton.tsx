import React, { ReactNode } from "react";

type DefaultButtonProps = {
  children: ReactNode;
  onClick: () => void;
  id?: string;
  disabled: boolean;
};

export const DefaultButton = ({ children, onClick, id, disabled }: DefaultButtonProps) => {
  return (
    <button id={id} onClick={onClick} disabled={disabled}>
      <div className="button-text">{children}</div>
    </button>
  );
};
