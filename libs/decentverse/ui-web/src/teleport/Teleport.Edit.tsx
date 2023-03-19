import { Input } from "antd";
import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { Field, OnlyAdmin } from "@shared/ui-web";
import { useRef } from "react";
import { Mesh, PlaneGeometry, Vector3 } from "three";
import { AreaBox, EditPosition } from "../common";

interface TeleportEditProps {
  teleportId?: string | null;
  slice?: slice.TeleportSlice;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const TeleportEdit = ({ slice = st.slice.teleport, teleportId = undefined }: TeleportEditProps) => {
  const teleportForm = slice.use.teleportForm();
  const { l } = useLocale();
  return (
    <>
      <AreaBox color="rgba(255, 102, 102, 0.5)" wh={teleportForm.wh} center={teleportForm.center} />
      <EditPosition
        wh={teleportForm.wh}
        center={teleportForm.center}
        setCenter={slice.do.setCenterOnTeleport}
        setWh={slice.do.setWhOnTeleport}
      />
      <Field.Text label="href" value={teleportForm.href} onChange={(numbers) => slice.do.setHrefOnTeleport(numbers)} />
    </>
  );
};

const TeleportEditPreview = ({ slice = st.slice.teleport }: TeleportEditProps) => {
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
TeleportEdit.Preview = TeleportEditPreview;
