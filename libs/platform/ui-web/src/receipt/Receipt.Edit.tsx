import { Input } from "antd";
import { gql, st, slice, useLocale } from "@platform/data-access";
import { DataEditModal, Editor, OnlyAdmin } from "@shared/ui-web";
import { Field } from "@shared/ui-web";
import { useEffect } from "react";
import { cnst } from "@shared/util";
import dayjs from "dayjs";

interface ReceiptEditProps {
  slice?: slice.ReceiptSlice;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const ReceiptEdit = ({ slice = st.slice.receipt }: ReceiptEditProps) => {
  const { l } = useLocale();
  const receiptForm = slice.use.receiptForm();
  return <div></div>;
};
