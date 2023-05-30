"use client";
import { st, usePage } from "@platform/client";

interface GeneralProps {
  sliceName?: string;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ sliceName = "receipt" }: GeneralProps) => {
  const { l } = usePage();
  const receiptForm = st.use.receiptForm();
  return <div></div>;
};
