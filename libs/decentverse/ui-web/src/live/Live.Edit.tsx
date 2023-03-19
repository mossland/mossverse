import { Input } from "antd";
import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { Editor, Field, OnlyAdmin } from "@shared/ui-web";
import { AreaBox } from "../common";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Mesh, PlaneGeometry, Vector3 } from "three";
import { Utils } from "@shared/util";

interface LiveEditProps {
  liveId?: string | null;
  slice?: slice.LiveSlice;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const LiveEdit = ({ slice = st.slice.live, liveId = undefined }: LiveEditProps) => {
  const liveForm = slice.use.liveForm();
  const { l } = useLocale();
  return (
    <>
      <AreaBox color="#D96704" wh={liveForm.wh} center={liveForm.center} />
      <Field.Text label="source" value={liveForm.src} onChange={(src) => slice.do.setSrcOnLive(src)} required />
    </>
  );
};

const LiveEditPreview = ({ slice = st.slice.live }: LiveEditProps) => {
  const mesh = useRef<Mesh>(null);
  const plane = useRef<PlaneGeometry>(null);
  const center = st.sel((state) => state.liveForm.center);
  const wh = st.sel((state) => state.liveForm.wh);
  return (
    <mesh ref={mesh} position={new Vector3(...center, 0.0001)}>
      {wh.length && <planeGeometry ref={plane} args={wh} />}
      <meshBasicMaterial color="#D96704" opacity={0.5} transparent />
    </mesh>
  );
};
LiveEdit.Preview = LiveEditPreview;
