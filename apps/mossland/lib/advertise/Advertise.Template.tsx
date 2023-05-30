"use client";
import { st, usePage } from "@mossland/client";

interface AdvertiseEditProps {
  advertiseId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ advertiseId = undefined }: AdvertiseEditProps) => {
  const advertiseForm = st.use.advertiseForm();
  const { l } = usePage();
  return (
    <div className="flex items-center mb-4">
      {/* <p className="w-20 mt-3">{l('advertise.field')}</p>
        <input
          className="w-full input input-bordered"
          value={advertiseForm.field}
          onChange={(e) => st.do.setFieldOnAdvertise(e.target.value)}
        /> */}
    </div>
  );
};
