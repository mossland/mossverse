"use client";
import { Field } from "@shared/client";
import { st, usePage } from "@decentverse/client";

interface GeneralProps {
  tileId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ tileId = undefined }: GeneralProps) => {
  const tileForm = st.use.tileForm();
  const { l } = usePage();
  return (
    <>
      <Field.Img
        label="lighting"
        file={tileForm.lighting}
        onRemove={() => st.do.setLightingOnTile(null)}
        addFiles={st.do.uploadLightingOnTile}
      />
      <Field.Img
        label="top"
        file={tileForm.top}
        onRemove={() => st.do.setTopOnTile(null)}
        addFiles={st.do.uploadTopOnTile}
      />
      <Field.Img
        label="wall"
        file={tileForm.wall}
        onRemove={() => st.do.setWallOnTile(null)}
        addFiles={st.do.uploadWallOnTile}
      />
      <Field.Img
        label="bottom"
        file={tileForm.bottom}
        onRemove={() => st.do.setBottomOnTile(null)}
        addFiles={st.do.uploadBottomOnTile}
        required
      />
      <Field.DoubleNumber label="Width Height" value={tileForm.wh} onChange={st.do.setWhOnTile} />
      <Field.DoubleNumber label="Center" value={tileForm.center} onChange={st.do.setCenterOnTile} />
    </>
  );
};
