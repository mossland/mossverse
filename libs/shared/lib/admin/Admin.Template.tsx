"use client";
import { Field, st, usePage } from "@shared/client";

interface AdminEditProps {
  adminId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ adminId = undefined }: AdminEditProps) => {
  const adminForm = st.use.adminForm();
  const { l } = usePage();
  return (
    <>
      <Field.Text label={l("admin.accountId")} value={adminForm.accountId} onChange={st.do.setAccountIdOnAdmin} />
      <Field.Password
        value={adminForm.password}
        onChange={(password) => {
          console.log(password);
          st.do.setPasswordOnAdmin(password);
        }}
      />
    </>
  );
};
