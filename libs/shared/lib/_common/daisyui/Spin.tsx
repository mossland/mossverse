import { AiOutlineLoading } from "react-icons/ai";
import React, { ReactNode } from "react";

type SpinProps = {
  indicator?: ReactNode;
};

export const Spin = ({ indicator }: SpinProps) => {
  return (
    <div className="inline-block py-1">
      {indicator ? (
        <div className="[&>svg]:animate-spin">{indicator}</div>
      ) : (
        <AiOutlineLoading className="text-xl animate-spin text-primary/60" />
      )}
    </div>
  );
};
