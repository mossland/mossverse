import { Input } from "antd";
import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { Editor, Field, OnlyAdmin } from "@shared/ui-web";

interface TileEditProps {
  tileId?: string | null;
  slice?: slice.TileSlice;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const TileEdit = ({ slice = st.slice.tile, tileId = undefined }: TileEditProps) => {
  const tileForm = slice.use.tileForm();
  const { l } = useLocale();
  return (
    <>
      <Field.Img
        label="lighting"
        file={tileForm.lighting}
        onRemove={() => slice.do.setLightingOnTile(null)}
        addFiles={st.do.uploadLightingOnTile}
      />
      <Field.Img
        label="top"
        file={tileForm.top}
        onRemove={() => slice.do.setTopOnTile(null)}
        addFiles={st.do.uploadTopOnTile}
      />
      <Field.Img
        label="wall"
        file={tileForm.wall}
        onRemove={() => slice.do.setWallOnTile(null)}
        addFiles={st.do.uploadWallOnTile}
      />
      <Field.Img
        label="bottom"
        file={tileForm.bottom}
        onRemove={() => slice.do.setBottomOnTile(null)}
        addFiles={st.do.uploadBottomOnTile}
        required
      />
      <Field.DoubleNumber label="Width Height" value={tileForm.wh} onChange={slice.do.setWhOnTile} />
      <Field.DoubleNumber label="Center" value={tileForm.center} onChange={slice.do.setCenterOnTile} />
    </>
  );
};
