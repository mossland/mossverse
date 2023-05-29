"use client";
import { st, usePage } from "@platform/client";

interface GeneralProps {
  shipInfoId?: string | null;
  sliceName?: string;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ sliceName = "shipInfo", shipInfoId = undefined }: GeneralProps) => {
  const shipInfoForm = st.use.shipInfoForm();
  const { l } = usePage();
  return (
    <div className="flex items-center mb-4">
      <p className="w-20 mt-3">{l("shipInfo.id")}</p>
      {/* <input
          className="w-full input input-bordered"
          value={shipInfoForm.field}
          onChange={(e) => slice.do.setFieldOnShipInfo(e.target.value)}
        /> */}
    </div>
  );
};
