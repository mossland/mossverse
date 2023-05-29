"use client";
import { st, usePage } from "@shared/client";

interface OwnershipEditProps {
  ownershipId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ ownershipId = undefined }: OwnershipEditProps) => {
  const ownershipForm = st.use.ownershipForm();
  const { l } = usePage();
  return (
    <div className="flex items-center mb-4">
      {/* <p className="w-20 mt-3">{l("ownership.field")}</p> */}
      {/* <input className="input input-bordered" value={ownershipForm.field} onChange={(e) => slice.do.setFieldOnOwnership(e.target.value)} /> */}
    </div>
  );
};
