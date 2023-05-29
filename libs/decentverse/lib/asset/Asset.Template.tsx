"use client";
import { Field } from "@shared/client";
import { st, usePage } from "@decentverse/client";

interface AssetEditProps {
  assetId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ assetId = undefined }: AssetEditProps) => {
  const assetForm = st.use.assetForm();
  const { l } = usePage();
  return (
    <>
      <Field.Text label="Name" value={assetForm.name} onChange={st.do.setNameOnAsset} />
      <Field.Img
        label="Bottom"
        addFiles={st.do.uploadBottomOnAsset}
        file={assetForm.bottom}
        onRemove={() => st.do.setBottomOnAsset(null)}
      />
      <Field.Img
        label="Wall"
        addFiles={st.do.uploadWallOnAsset}
        file={assetForm.wall}
        onRemove={() => st.do.setWallOnAsset(null)}
      />
      <Field.Img
        label="Top"
        addFiles={st.do.uploadTopOnAsset}
        file={assetForm.top}
        onRemove={() => st.do.setTopOnAsset(null)}
      />
      <Field.Img
        label="Lighting"
        addFiles={st.do.uploadLightingOnAsset}
        file={assetForm.lighting}
        onRemove={() => st.do.setLightingOnAsset(null)}
      />
    </>
  );
};
