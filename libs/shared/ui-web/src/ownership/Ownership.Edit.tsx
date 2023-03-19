import { gql, st, slice, useLocale } from "@shared/data-access";
import { Editor, OnlyAdmin } from "@shared/ui-web";

interface OwnershipEditProps {
  ownershipId?: string | null;
  slice?: slice.OwnershipSlice;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const OwnershipEdit = ({ slice = st.slice.ownership, ownershipId = undefined }: OwnershipEditProps) => {
  const ownershipForm = slice.use.ownershipForm();
  const { l } = useLocale();
  return (
    <>
      <div className="flex items-center mb-4">
        {/* <p className="w-20 mt-3">{l("ownership.field")}</p> */}
        {/* <input className="input input-bordered" value={ownershipForm.field} onChange={(e) => slice.do.setFieldOnOwnership(e.target.value)} /> */}
      </div>
    </>
  );
};
