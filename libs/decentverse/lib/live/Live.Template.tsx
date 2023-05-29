"use client";
import { AreaBox } from "../../client";
import { Field } from "@shared/client";
import { Mesh, PlaneGeometry, Vector3 } from "three";
import { st, usePage } from "@decentverse/client";
import { useRef } from "react";

interface GeneralProps {
  liveId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ liveId = undefined }: GeneralProps) => {
  const liveForm = st.use.liveForm();
  const { l } = usePage();
  return (
    <>
      <AreaBox color="#D96704" wh={liveForm.wh} center={liveForm.center} />
      <Field.Text label="source" value={liveForm.src} onChange={(src) => st.do.setSrcOnLive(src)} required />
    </>
  );
};

export const Preview = () => {
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
