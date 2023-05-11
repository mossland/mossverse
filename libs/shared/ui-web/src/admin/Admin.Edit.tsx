import { Input } from "antd";
import { gql, st, slice, useLocale } from "@shared/data-access";
import { Editor, Field, OnlyAdmin } from "@shared/ui-web";
import { cnst } from "@shared/util";

interface AdminEditProps {
  adminId?: string | null;
  slice?: slice.AdminSlice;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const AdminEdit = ({ slice = st.slice.admin, adminId = undefined }: AdminEditProps) => {
  const adminForm = slice.use.adminForm();
  const { l } = useLocale();
  return (
    <>
      <Field.Text label={l("admin.accountId")} value={adminForm.accountId} onChange={slice.do.setAccountIdOnAdmin} />
      <Field.Password value={adminForm.password} onChange={slice.do.setPasswordOnAdmin} />
    </>
  );
};
