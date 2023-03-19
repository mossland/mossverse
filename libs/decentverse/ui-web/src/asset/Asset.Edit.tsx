import { Input } from "antd";
import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { Editor, Field, OnlyAdmin } from "@shared/ui-web";

interface AssetEditProps {
  assetId?: string | null;
  slice?: slice.AssetSlice;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const AssetEdit = ({ slice = st.slice.asset, assetId = undefined }: AssetEditProps) => {
  const assetForm = slice.use.assetForm();
  const { l } = useLocale();
  return (
    <>
      <Field.Text label="Name" value={assetForm.name} onChange={slice.do.setNameOnAsset} />
      <Field.Img
        label="Bottom"
        addFiles={slice.do.uploadBottomOnAsset}
        file={assetForm.bottom}
        onRemove={() => slice.do.setBottomOnAsset(null)}
      />
      <Field.Img
        label="Wall"
        addFiles={slice.do.uploadWallOnAsset}
        file={assetForm.wall}
        onRemove={() => slice.do.setWallOnAsset(null)}
      />
      <Field.Img
        label="Top"
        addFiles={slice.do.uploadTopOnAsset}
        file={assetForm.top}
        onRemove={() => slice.do.setTopOnAsset(null)}
      />
      <Field.Img
        label="Lighting"
        addFiles={slice.do.uploadLightingOnAsset}
        file={assetForm.lighting}
        onRemove={() => slice.do.setLightingOnAsset(null)}
      />
    </>
  );
};
