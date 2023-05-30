"use client";
import { AreaBox, EditPosition } from "../../client";
import { Field } from "@shared/client";
import { Mesh, PlaneGeometry, Vector3 } from "three";
import { st, usePage } from "@decentverse/client";
import { useRef } from "react";

interface GeneralProps {
  teleportId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ teleportId = undefined }: GeneralProps) => {
  const teleportForm = st.use.teleportForm();
  const { l } = usePage();
  return (
    <>
      <AreaBox color="rgba(255, 102, 102, 0.5)" wh={teleportForm.wh} center={teleportForm.center} />
      <EditPosition
        wh={teleportForm.wh}
        center={teleportForm.center}
        setCenter={st.do.setCenterOnTeleport}
        setWh={st.do.setWhOnTeleport}
      />
      <Field.Text label="href" value={teleportForm.href} onChange={(numbers) => st.do.setHrefOnTeleport(numbers)} />
    </>
  );
};

export const Preview = () => {
  const mesh = useRef<Mesh>(null);
  const plane = useRef<PlaneGeometry>(null);
  const center = st.sel((state) => state.teleportForm.center);
  const wh = st.sel((state) => state.teleportForm.wh);
  return (
    <mesh ref={mesh} position={new Vector3(...center, 0.0001)}>
      {wh.length && <planeGeometry ref={plane} args={wh} />}
      <meshBasicMaterial color="#2222cc" opacity={0.5} transparent />
    </mesh>
  );
};
