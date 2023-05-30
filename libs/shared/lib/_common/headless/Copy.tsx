"use client";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { st } from "@shared/client";

export interface CopyProps {
  text?: string;
  children: any;
}
export const Copy = ({ text, children }: CopyProps) => {
  return (
    <CopyToClipboard text={text ?? ""} onCopy={() => st.do.showMessage({ content: "Copied", type: "success" })}>
      {children}
    </CopyToClipboard>
  );
};
